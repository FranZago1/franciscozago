"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { pesos } from "../shared/util";
import { CATEGORIAS, eanCheck, prefijo, PROVEEDORES, redondeo, type Categoria } from "./data";
import { useStock } from "./context";
import { btn, input, label, mono } from "./ui";

export function AltaProducto({ open, ean, onClose }: { open: boolean; ean?: string; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      titulo="Alta de producto"
      subtitulo={<p className="text-xs text-white/60">Los campos con * son obligatorios.</p>}
      panelClassName="max-h-[94dvh] w-full bg-[#F6F5F2] shadow-2xl sm:max-w-2xl"
      overlayClassName="bg-black/60"
      headerClassName="bg-[#1C1E22] px-4 py-3 text-white"
      tituloClassName="text-sm font-bold uppercase tracking-[0.12em] text-[#F26B1D]"
      cerrarClassName="-mr-1 text-white/70 hover:text-white"
    >
      {open ? <Form eanInicial={ean} onClose={onClose} /> : null}
    </Dialog>
  );
}

type Campos = {
  nombre: string;
  categoria: Categoria;
  proveedor: string;
  sku: string;
  ean: string;
  unidad: string;
  ubicacion: string;
  stock: string;
  minimo: string;
  costo: string;
  venta: string;
};

function Form({ eanInicial, onClose }: { eanInicial?: string; onClose: () => void }) {
  const { state, crearProducto } = useStock();
  const form = useRef<HTMLFormElement>(null);

  const skuSugerido = (c: Categoria) => {
    const usados = new Set(state.productos.map((p) => p.sku));
    let n = 100 + state.productos.filter((p) => p.categoria === c).length * 7 + 7;
    while (usados.has(`${prefijo(c)}-${String(n).padStart(4, "0")}`)) n += 7;
    return `${prefijo(c)}-${String(n).padStart(4, "0")}`;
  };
  const eanNuevo = () => {
    const doce = `7798${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}`;
    return doce + eanCheck(doce);
  };

  const [v, setV] = useState<Campos>(() => ({
    nombre: "",
    categoria: "Herramientas",
    proveedor: PROVEEDORES[1],
    sku: skuSugerido("Herramientas"),
    ean: eanInicial ?? eanNuevo(),
    unidad: "unidad",
    ubicacion: "",
    stock: "0",
    minimo: "5",
    costo: "",
    venta: "",
  }));
  const [err, setErr] = useState<Partial<Record<keyof Campos, string>>>({});
  const [enviado, setEnviado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const validar = (x: Campos) => {
    const e: Partial<Record<keyof Campos, string>> = {};
    if (x.nombre.trim().length < 4) e.nombre = "Describí el producto (mínimo 4 caracteres).";
    if (!/^[A-Z]{3}-\d{4}$/.test(x.sku)) e.sku = "Formato: ABC-0000.";
    else if (state.productos.some((p) => p.sku === x.sku)) e.sku = "Ese SKU ya existe.";
    if (!/^\d{13}$/.test(x.ean)) e.ean = "El EAN tiene 13 dígitos.";
    else if (eanCheck(x.ean.slice(0, 12)) !== x.ean[12]) e.ean = "Dígito verificador inválido.";
    else if (state.productos.some((p) => p.ean === x.ean)) e.ean = "Ese código ya está cargado.";
    const st = Number(x.stock);
    const mi = Number(x.minimo);
    if (x.stock === "" || !Number.isInteger(st) || st < 0) e.stock = "Entero, 0 o más.";
    if (x.minimo === "" || !Number.isInteger(mi) || mi < 1) e.minimo = "Entero, 1 o más.";
    const co = Number(x.costo);
    const ve = Number(x.venta);
    if (!x.costo || !(co > 0)) e.costo = "Ingresá el costo.";
    if (!x.venta || !(ve > 0)) e.venta = "Ingresá el precio de venta.";
    else if (co > 0 && ve <= co) e.venta = "Tiene que ser mayor al costo.";
    return e;
  };

  function set<K extends keyof Campos>(k: K, val: Campos[K]) {
    let nv = { ...v, [k]: val };
    if (k === "categoria") nv = { ...nv, sku: skuSugerido(val as Categoria) };
    setV(nv);
    if (enviado) setErr(validar(nv));
  }

  const margen = useMemo(() => {
    const co = Number(v.costo);
    const ve = Number(v.venta);
    return co > 0 && ve > 0 ? Math.round(((ve - co) / ve) * 100) : null;
  }, [v.costo, v.venta]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
    const errores = validar(v);
    setErr(errores);
    const k = Object.keys(errores)[0];
    if (k) {
      form.current?.querySelector<HTMLElement>(`[name="${k}"]`)?.focus();
      return;
    }
    setGuardando(true);
    window.setTimeout(() => {
      crearProducto({
        nombre: v.nombre.trim(),
        categoria: v.categoria,
        proveedor: v.proveedor,
        sku: v.sku,
        ean: v.ean,
        unidad: v.unidad,
        ubicacion: v.ubicacion.trim().toUpperCase() || "—",
        stock: Number(v.stock),
        minimo: Number(v.minimo),
        costo: Number(v.costo),
        venta: Number(v.venta),
      });
      onClose();
    }, 400);
  }

  const num = (s: string) => s.replace(/[^\d]/g, "");
  const nErr = Object.keys(err).length;

  return (
    <form ref={form} onSubmit={submit} noValidate>
      <div className="space-y-4 p-4 sm:p-5">
        {enviado && nErr ? (
          <p role="alert" className="flex items-center gap-2 border-l-4 border-[#C0262D] bg-[#FFF3F3] px-3 py-2 text-sm font-semibold text-[#9F1D1D]">
            <Icon name="alert" className="size-4" /> Hay {nErr} campo{nErr > 1 ? "s" : ""} para revisar.
          </p>
        ) : null}
        <Campo id="ap-nombre" txt="Descripción *" error={err.nombre}>
          <input id="ap-nombre" name="nombre" data-autofocus className={input} value={v.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej.: Llave francesa 10&quot; cromada" aria-invalid={!!err.nombre} aria-describedby={err.nombre ? "ap-nombre-err" : undefined} />
        </Campo>
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo id="ap-cat" txt="Categoría">
            <select id="ap-cat" name="categoria" className={input} value={v.categoria} onChange={(e) => set("categoria", e.target.value as Categoria)}>
              {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Campo>
          <Campo id="ap-prov" txt="Proveedor">
            <select id="ap-prov" name="proveedor" className={input} value={v.proveedor} onChange={(e) => set("proveedor", e.target.value)}>
              {PROVEEDORES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Campo>
          <Campo id="ap-sku" txt="SKU *" error={err.sku}>
            <input id="ap-sku" name="sku" className={`${input} ${mono} uppercase`} value={v.sku} onChange={(e) => set("sku", e.target.value.toUpperCase())} aria-invalid={!!err.sku} aria-describedby={err.sku ? "ap-sku-err" : undefined} />
          </Campo>
          <Campo id="ap-ean" txt="Código de barras (EAN-13) *" error={err.ean}>
            <div className="flex">
              <input id="ap-ean" name="ean" inputMode="numeric" className={`${input} ${mono} rounded-r-none`} value={v.ean} onChange={(e) => set("ean", num(e.target.value).slice(0, 13))} aria-invalid={!!err.ean} aria-describedby={err.ean ? "ap-ean-err" : undefined} />
              <button type="button" onClick={() => set("ean", eanNuevo())} className="shrink-0 border border-l-0 border-[#BDB9B0] bg-white px-2.5 text-[11px] font-bold uppercase hover:bg-[#F0EFEB]" aria-label="Generar código interno">
                Generar
              </button>
            </div>
          </Campo>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Campo id="ap-unidad" txt="Unidad">
            <select id="ap-unidad" name="unidad" className={input} value={v.unidad} onChange={(e) => set("unidad", e.target.value)}>
              {["unidad", "caja", "bolsa", "kg", "metro", "rollo", "lata", "par"].map((u) => <option key={u}>{u}</option>)}
            </select>
          </Campo>
          <Campo id="ap-ubic" txt="Ubicación">
            <input id="ap-ubic" name="ubicacion" className={`${input} ${mono} uppercase`} value={v.ubicacion} onChange={(e) => set("ubicacion", e.target.value)} placeholder="B2-04" />
          </Campo>
          <Campo id="ap-stock" txt="Stock inicial *" error={err.stock}>
            <input id="ap-stock" name="stock" inputMode="numeric" className={`${input} ${mono}`} value={v.stock} onChange={(e) => set("stock", num(e.target.value))} aria-invalid={!!err.stock} aria-describedby={err.stock ? "ap-stock-err" : undefined} />
          </Campo>
          <Campo id="ap-min" txt="Mínimo *" error={err.minimo}>
            <input id="ap-min" name="minimo" inputMode="numeric" className={`${input} ${mono}`} value={v.minimo} onChange={(e) => set("minimo", num(e.target.value))} aria-invalid={!!err.minimo} aria-describedby={err.minimo ? "ap-min-err" : undefined} />
          </Campo>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
          <Campo id="ap-costo" txt="Costo ($) *" error={err.costo}>
            <input id="ap-costo" name="costo" inputMode="numeric" className={`${input} ${mono}`} value={v.costo} onChange={(e) => set("costo", num(e.target.value))} placeholder="0" aria-invalid={!!err.costo} aria-describedby={err.costo ? "ap-costo-err" : undefined} />
          </Campo>
          <Campo id="ap-venta" txt="Venta ($) *" error={err.venta}>
            <input id="ap-venta" name="venta" inputMode="numeric" className={`${input} ${mono}`} value={v.venta} onChange={(e) => set("venta", num(e.target.value))} placeholder="0" aria-invalid={!!err.venta} aria-describedby={err.venta ? "ap-venta-err" : undefined} />
          </Campo>
          <div className="col-span-2 flex items-end gap-2 sm:col-span-1 sm:pt-5">
            <button type="button" disabled={!(Number(v.costo) > 0)} onClick={() => set("venta", String(redondeo(Number(v.costo) * 1.6)))} className={`${btn.secundario} h-10 whitespace-nowrap px-2.5 text-xs`}>
              Costo +60 %
            </button>
            <p className={`${mono} min-w-16 text-sm`} aria-live="polite">
              {margen !== null ? <>Margen <b className={margen < 20 ? "text-[#C0262D]" : "text-[#1F7A3E]"}>{margen}%</b></> : null}
            </p>
          </div>
        </div>
        {Number(v.costo) > 0 && Number(v.stock) > 0 ? (
          <p className="text-xs text-[#6B6860]">Valor del stock inicial: <span className={`${mono} font-semibold text-[#1C1E22]`}>{pesos(Number(v.costo) * Number(v.stock))}</span></p>
        ) : null}
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-[#D9D6CF] bg-white p-3 sm:flex-row sm:items-center sm:justify-end">
        <p className="text-xs text-[#6B6860] sm:mr-auto">Demo: queda guardado solo en tu navegador.</p>
        <button type="button" className={btn.secundario} onClick={onClose}>Cancelar</button>
        <button type="submit" className={btn.primario} disabled={guardando}>
          {guardando ? "Guardando…" : <><Icon name="check" className="size-4" strokeWidth={2.6} /> Dar de alta</>}
        </button>
      </div>
    </form>
  );
}

function Campo({ id, txt, error, children }: { id: string; txt: string; error?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={label}>{txt}</label>
      {children}
      {error ? <p id={`${id}-err`} className="mt-1 text-xs font-semibold text-[#C0262D]">{error}</p> : null}
    </div>
  );
}
