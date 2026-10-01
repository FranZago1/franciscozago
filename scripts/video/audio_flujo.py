"""Video del flujo (flujo.html): música y sonidos de interfaz, sintetizados desde cero (sin samples ni licencias de terceros).

120 BPM, 11 compases (22 s), arranca en un downbeat y loopea sin corte: las colas del final se suman al inicio.
Cada sonido de UI se ubica alineando su pico medido con el tiempo del evento en motion.html.

Uso: python3 audio.py salida.wav
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
BARS = 11
T = BARS * 4 * BEAT  # 22 s
TAIL = 3.0
N = int(SR * (T + TAIL))
rng = np.random.default_rng(7)


def t_axis(dur):
    return np.arange(int(SR * dur)) / SR


def env(dur, a=0.002, d=0.2, curve=1.0):
    t = t_axis(dur)
    att = np.clip(t / a, 0, 1) if a > 0 else 1
    return att * np.exp(-t / d) ** curve


def lowpass(x, fc):
    # Un polo, ida y vuelta (sin desfase).
    k = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - k) * v + k * acc
        y[i] = acc
    acc = 0.0
    for i in range(len(y) - 1, -1, -1):
        acc = (1 - k) * y[i] + k * acc
        y[i] = acc
    return y


def band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def hz(n):  # MIDI -> Hz
    return 440 * 2 ** ((n - 69) / 12)


def add(buf, sig, t, gain=1.0):
    i = int(round(t * SR))
    j = min(len(buf), i + len(sig))
    if i < 0:
        sig = sig[-i:]
        i = 0
        j = min(len(buf), len(sig))
    buf[i:j] += sig[: j - i] * gain


def add_peak(buf, sig, t, gain=1.0):
    """Ubica el sonido de forma que su pico medido caiga exactamente en t."""
    pk = int(np.argmax(np.abs(lowpass(np.abs(sig), 400))))
    add(buf, sig, t - pk / SR, gain)


# ───────────── Instrumentos ─────────────
def kick():
    t = t_axis(0.45)
    f = 46 + 110 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.22)
    click = band(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t / 0.004) * 0.25
    return np.tanh(1.6 * (body + click)) * 0.9


def clap():
    t = t_axis(0.5)
    n = band(rng.standard_normal(len(t)), 900, 5200)
    e = np.zeros_like(t)
    for k, o in enumerate([0, 0.011, 0.022]):
        e += np.where(t >= o, np.exp(-(t - o) / (0.012 if k < 2 else 0.16)), 0)
    return n * e * 0.38


def hat(open_=False):
    t = t_axis(0.25)
    n = band(rng.standard_normal(len(t)), 7000, 16000)
    return n * np.exp(-t / (0.09 if open_ else 0.028)) * 0.22


def bass(note, dur):
    t = t_axis(dur)
    f = hz(note)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    e = np.clip(t / 0.004, 0, 1) * np.exp(-t / (dur * 0.9))
    return lowpass(x * e, 900) * 0.42


def keys(notes, dur):
    """Stab tipo piano eléctrico: senos con armónicos que decaen."""
    t = t_axis(dur)
    x = np.zeros_like(t)
    for n in notes:
        f = hz(n)
        x += np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * f * t) * np.exp(-t / 0.08))
        x += 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.12)
    return x * np.clip(t / 0.003, 0, 1) * np.exp(-t / 0.32) * 0.07


def pad(notes, dur):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for n in notes:
        for det in (-0.08, 0.08):
            f = hz(n + det)
            x += np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * t)
    x = lowpass(x, 1400)
    e = np.clip(t / 0.25, 0, 1) * np.clip((dur - t) / 0.3, 0, 1)
    return x * e * 0.018


def pluck(note, dur=0.22):
    t = t_axis(dur)
    f = hz(note)
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t / 0.03)
    return x * np.clip(t / 0.002, 0, 1) * np.exp(-t / 0.07) * 0.05


# Progresión (MIDI): F · Am · Dm · G, dos veces, F · Am · Gsus → vuelve a F
F, AM, DM, G, GSUS = (41, [57, 60, 64, 67]), (45, [57, 60, 64, 67]), (38, [57, 60, 62, 65]), (43, [55, 59, 62, 64]), (43, [55, 60, 62, 67])
CHORDS = [F, AM, DM, G, F, AM, DM, G, F, AM, GSUS]
# Etapas por compás: 0-1 necesito una web · 2-3 mi sitio · 4-5 charla · 6-8 trabajando · 9 publicado · 10 cierre
drums = np.zeros(N)
music = np.zeros(N)
side = np.zeros(N)  # envolvente de sidechain
K, C, HC, HO = kick(), clap(), hat(), hat(True)
for bar in range(BARS):
    t0 = bar * 4 * BEAT
    root, ch = CHORDS[bar]
    for beat in range(4):
        tb = t0 + beat * BEAT
        add(drums, K, tb)
        add(side, np.exp(-t_axis(0.3) / 0.09), tb)
        if beat in (1, 3) and bar >= 2:
            add(drums, C, tb)
        add(drums, HO if (beat == 3 and bar % 2 == 1) else HC, tb + BEAT / 2)
        for s in (0.25, 0.75):
            if 6 <= bar <= 9:
                add(drums, HC, tb + s * BEAT, 0.35)
        # Bajo: corcheas con salto de octava en los contratiempos
        add(music, bass(root, BEAT * 0.45), tb)
        add(music, bass(root + 12 if beat % 2 else root, BEAT * 0.4), tb + BEAT / 2, 0.8)
    # Acordes: stabs sincopados y colchón
    for s in (0.5, 1.5, 2.5, 3.25):
        add(music, keys(ch, 0.6), t0 + s * BEAT)
    add(music, pad(ch, 4 * BEAT + 0.2), t0)
    # Arpegio en 16avos desde el compás 3 (el beat del dashboard en adelante)
    if 6 <= bar <= 9:
        arp = ch + [ch[1] + 12]
        for k in range(16):
            add(music, pluck(arp[k % len(arp)] + 12), t0 + k * BEAT / 4, 0.9 if k % 4 == 0 else 0.6)

# Sidechain: el bajo y los acordes se agachan con cada bombo
duck = 1 - 0.55 * np.clip(side, 0, 1)
mix = drums + music * duck


# ───────────── Sonidos de interfaz ─────────────
def ui_click(f=2600, g=1.0):
    t = t_axis(0.06)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.006)
    n = band(rng.standard_normal(len(t)), 2000, 9000) * np.exp(-t / 0.003) * 0.6
    return (s + n) * 0.32 * g


def ui_pop(f0=520, f1=1100):
    t = t_axis(0.12)
    f = f0 + (f1 - f0) * (1 - np.exp(-t / 0.02))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.clip(t / 0.003, 0, 1) * np.exp(-t / 0.035) * 0.3


def ui_tone(notes, gap=0.07, d=0.18, g=0.16):
    out = np.zeros(int(SR * (gap * len(notes) + d + 0.3)))
    for i, n in enumerate(notes):
        t = t_axis(d + 0.3)
        s = (np.sin(2 * np.pi * hz(n) * t) + 0.2 * np.sin(2 * np.pi * 2 * hz(n) * t)) * np.clip(t / 0.004, 0, 1) * np.exp(-t / d)
        add(out, s, i * gap)
    return out * g


def ui_whoosh(dur=0.28, lo=500, hi=4500, g=0.11):
    t = t_axis(dur)
    n = band(rng.standard_normal(len(t)), lo, hi)
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2
    return n * e * g


def ui_glide(dur, f0, f1, g=0.05):
    t = t_axis(dur)
    f = f0 * (f1 / f0) ** (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / dur) ** 1.5 * g


ui = np.zeros(N)


def teclas(t0, t1, n, g=0.3):
    for k in range(n):
        add_peak(ui, ui_click(4200 + 300 * (k % 3), g), t0 + (k + 1) * (t1 - t0) / n)


# 01 · el cliente escribe, aparecen los problemas, busca
teclas(0.12, 1.25, 33, 0.22)
for tm in (1.5, 2.0, 2.5):
    add_peak(ui, ui_pop(420, 820), tm + 0.06)
teclas(3.1, 3.44, 25, 0.22)
add_peak(ui, ui_click(900, 1.1), 3.5)        # enter
# morphs entre etapas
for tm in (3.0, 4.0, 8.0, 12.0, 16.5, 18.0, 19.0, 19.5, 20.0, 21.5):
    add_peak(ui, ui_whoosh(), tm)
# 02 · scroll y clic en "Escribime por WhatsApp"
for tm in (5.0, 6.0):
    add(ui, ui_whoosh(0.4, 200, 1600, 0.07), tm)
add_peak(ui, ui_click(), 7.0)
# 03 · charla: tipeo, envío y mensajes entrantes
for a, z, n in ((8.08, 8.38, 29), (9.6, 9.88, 27), (11.1, 11.38, 24)):
    teclas(a, z, n, 0.18)
for tm in (8.5, 10.0, 11.5):
    add_peak(ui, ui_click(2000), tm)
    add_peak(ui, ui_pop(700, 1300), tm + 0.05)
for tm in (9.5, 11.0):
    add_peak(ui, ui_tone([84, 88], 0.06, 0.14, 0.12), tm + 0.04)
# 04 · editor: dibujar el hero y el botón (arrastres), tipear, color, calendario, aviso, mobile, publicar
for a, z in ((12.25, 12.55), (13.1, 13.45)):
    add_peak(ui, ui_click(1700), a)
    add(ui, ui_glide(z - a, 260, 620, 0.04), a)
    add_peak(ui, ui_click(2300), z)
teclas(12.65, 12.95, 13, 0.22)
add_peak(ui, ui_pop(600, 1000), 13.42)       # aparece el panel de relleno
for tm in (14.0, 15.0, 15.5, 16.5, 17.5):
    add_peak(ui, ui_click(), tm)
add(ui, ui_whoosh(0.22, 800, 5000, 0.06), 14.42)  # cae el calendario
add_peak(ui, ui_pop(500, 900), 14.55)
add_peak(ui, ui_click(1900), 16.0)           # toggle: dos clics
add_peak(ui, ui_click(3100, 0.7), 16.06)
# 05 · publicar, publicado y la primera reserva
add(ui, ui_glide(0.8, 300, 1000, 0.035), 18.1)
add_peak(ui, ui_tone([81, 85, 88], 0.06, 0.22, 0.14), 19.0)
add_peak(ui, ui_tone([88, 93], 0.09, 0.3, 0.15), 19.6)
# 06 · cierre
add_peak(ui, ui_pop(700, 1500), 20.25)

mix = mix + ui * 1.15

# Loop: la cola que pasa de 14 s se suma al principio.
n_loop = int(SR * T)
out = mix[:n_loop].copy()
out[: N - n_loop] += mix[n_loop:]

# Master: saturación suave y normalización
out = np.tanh(out * 1.25) / np.tanh(1.25)
out = out / np.max(np.abs(out)) * 0.89

# ───────────── Verificación de la grilla ─────────────
# Filtro adaptado: correlación de la mezcla con el bombo → picos en cada golpe, separados al menos 0.35 s.
# Deben caer sobre la grilla de 0.5 s.
nfft = 1 << int(np.ceil(np.log2(len(out) + len(K))))
corr = np.fft.irfft(np.fft.rfft(out, nfft) * np.conj(np.fft.rfft(K, nfft)), nfft)[: len(out)]
dist = int(0.35 * SR)
peaks = []
for i in np.argsort(corr)[::-1]:
    if corr[i] < corr.max() * 0.4 or len(peaks) >= int(T / BEAT) + 8:
        break
    if all(abs(i - j) > dist for j in peaks):
        peaks.append(i)
onsets = np.sort(np.array(peaks) / SR)
grid = np.arange(0, T, BEAT)
err = [np.min(np.abs(onsets - g)) for g in grid]
print(f"onsets: {len(onsets)} · beats: {len(grid)} · error medio: {np.mean(err) * 1000:.1f} ms · máx: {max(err) * 1000:.1f} ms · primer onset: {onsets[0] * 1000:.1f} ms")

pcm = (out * 32767).astype(np.int16)
stereo = np.stack([pcm, pcm], axis=1).reshape(-1)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(stereo.tobytes())
print("ok", sys.argv[1], f"{len(out) / SR:.2f}s")
