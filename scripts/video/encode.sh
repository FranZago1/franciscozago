#!/bin/bash
# Une video + audio y exporta las versiones web. Uso: ./encode.sh <video-sin-audio.mp4> <audio.wav>
set -euo pipefail
FF=$(python3 -c "import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())")
OUT="$(dirname "$0")/../../public/videos"
mkdir -p "$OUT"
for size in 1080 720; do
  crf=$([ "$size" = 1080 ] && echo 21 || echo 24)
  "$FF" -y -loglevel error -i "$1" -i "$2" -map 0:v -map 1:a \
    -vf "scale=$size:$size:flags=lanczos" -c:v libx264 -preset slow -crf "$crf" -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 160k -shortest -movflags +faststart "$OUT/motion-$size.mp4"
  "$FF" -y -loglevel error -i "$1" -i "$2" -map 0:v -map 1:a \
    -vf "scale=$size:$size:flags=lanczos" -c:v libvpx-vp9 -b:v 0 -crf "$([ "$size" = 1080 ] && echo 34 || echo 38)" -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p \
    -c:a libopus -b:a 128k -shortest "$OUT/motion-$size.webm"
done
"$FF" -y -loglevel error -ss 0 -i "$1" -frames:v 1 "$OUT/motion-poster.png"
node -e "require('sharp')('$OUT/motion-poster.png').resize(1080).webp({quality:86}).toFile('$OUT/motion-poster.webp').then(()=>require('fs').unlinkSync('$OUT/motion-poster.png'))"
ls -la "$OUT"
