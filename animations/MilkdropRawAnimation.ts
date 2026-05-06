import { CSSProperties } from "react";
import { GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase from "./AnimationBase";

const FFT_SIZE = 1024;

const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
};

const avgRange = (dataArr: Uint8Array, from: number, to: number) => {
  let sum = 0;
  const end = Math.min(to, dataArr.length);
  for (let i = from; i < end; i++) {
    sum += dataArr[i];
  }
  return sum / Math.max(1, end - from) / 255;
};

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }) => {
  const { setId, stop, bufferLength, dataArr, startMs } = AnimationBase.getBase(
    analyser,
    FFT_SIZE
  );

  const start = () => {
    resizeCanvas(canvas);
    analyser.getByteFrequencyData(dataArr);

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const t = (Date.now() - startMs) / 1000;
    const bass = avgRange(dataArr, 0, Math.floor(bufferLength * 0.08));
    const mids = avgRange(
      dataArr,
      Math.floor(bufferLength * 0.08),
      Math.floor(bufferLength * 0.35)
    );
    const highs = avgRange(
      dataArr,
      Math.floor(bufferLength * 0.35),
      bufferLength
    );

    const zoom = 1.006 + bass * 0.03;
    const rot = Math.sin(t * 0.6) * 0.004 + (mids - 0.35) * 0.01;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.94;
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(zoom, zoom);
    ctx.translate(-cx, -cy);
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.globalAlpha = 0.12 + highs * 0.1;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    const hue = (t * 35 + bass * 120) % 360;
    const radius = Math.min(w, h) * (0.15 + bass * 0.22);
    const spokes = 160;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.004);

    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      for (let i = 0; i <= spokes; i++) {
        const bin = Math.floor((i / spokes) * (bufferLength - 1));
        const level = dataArr[bin] / 255;
        const a = (i / spokes) * Math.PI * 2 + t * (0.12 + layer * 0.05);
        const wobble =
          Math.sin(a * (3 + layer) + t * (1.5 + layer)) *
          Math.min(w, h) *
          0.025;
        const r =
          radius +
          level * Math.min(w, h) * (0.16 + layer * 0.05) +
          wobble +
          layer * Math.min(w, h) * 0.05;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = clrUtils.getHSL(hue + layer * 60, 90, 42 + layer * 6);
      ctx.globalAlpha = 0.22 - layer * 0.05;
      ctx.stroke();
    }

    const pulseCount = 18;
    for (let i = 0; i < pulseCount; i++) {
      const bin = Math.floor((i / pulseCount) * bufferLength);
      const level = dataArr[bin] / 255;
      const a = (i / pulseCount) * Math.PI * 2 + t * 0.4;
      const r = Math.min(w, h) * (0.32 + level * 0.28);
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 3 + level * 14, 0, Math.PI * 2);
      ctx.fillStyle = clrUtils.getHSL(hue + i * 18, 90, 48);
      ctx.globalAlpha = 0.1 + level * 0.22;
      ctx.fill();
    }

    ctx.restore();

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
    gradient.addColorStop(0, `hsla(${hue}, 90%, 42%, ${0.06 + bass * 0.08})`);
    gradient.addColorStop(0.45, `hsla(${hue + 90}, 85%, 32%, 0.025)`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 1;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";

    setId(requestAnimationFrame(start));
  };

  return { start, stop };
};

const cssStyle: CSSProperties = {
  filter: "contrast(1.08) saturate(1.1) brightness(0.8)",
};

const MilkdropRawAnimation = { getAnimateFunc, cssStyle };
export default MilkdropRawAnimation;
