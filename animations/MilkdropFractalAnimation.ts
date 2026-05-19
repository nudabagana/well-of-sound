import { CSSProperties } from "react";
import { GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase, {
  FULL_HUE_ROTATION,
  resizeCanvas,
} from "./AnimationBase";

const FFT_SIZE = 1024;
const MAX_RENDERED_BIN_RATIO = 0.7;

const avgRange = (dataArr: Uint8Array, from: number, to: number) => {
  let sum = 0;
  const end = Math.min(to, dataArr.length);
  for (let i = from; i < end; i++) {
    sum += dataArr[i];
  }
  return sum / Math.max(1, end - from) / 255;
};

const getStormHue = (offset: number = 0) => 195 + offset;

const drawBranch = (
  ctx: CanvasRenderingContext2D,
  depth: number,
  length: number,
  spread: number,
  shrink: number,
  bend: number
) => {
  if (depth <= 0 || length < 2) {
    return;
  }

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -length);
  ctx.stroke();

  ctx.save();
  ctx.translate(0, -length);
  ctx.rotate(spread + bend);
  drawBranch(ctx, depth - 1, length * shrink, spread, shrink, bend * 0.92);
  ctx.restore();

  ctx.save();
  ctx.translate(0, -length);
  ctx.rotate(-spread + bend);
  drawBranch(ctx, depth - 1, length * shrink, spread, shrink, bend * 0.92);
  ctx.restore();
};

const drawGridCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  wobble: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.lineTo(0, -size * (1 + wobble));
  ctx.lineTo(size, 0);
  ctx.lineTo(0, size * (1 - wobble));
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }) => {
  const { requestNextFrame, stop, binCount, readFrequencyData, startMs } =
    AnimationBase.getBase(
      analyser,
      FFT_SIZE,
      MAX_RENDERED_BIN_RATIO
    );

  const start = () => {
    resizeCanvas(canvas);
    const frequencyData = readFrequencyData();

    const w = canvas.width;
    const h = canvas.height;
    const t = (Date.now() - startMs) / 1000;
    const bass = avgRange(frequencyData, 0, Math.floor(binCount * 0.08));
    const mids = avgRange(
      frequencyData,
      Math.floor(binCount * 0.08),
      Math.floor(binCount * 0.35)
    );
    const highs = avgRange(
      frequencyData,
      Math.floor(binCount * 0.35),
      binCount
    );

    const driftX = Math.sin(t * 0.25) * w * 0.01 + (mids - 0.5) * w * 0.008;
    const driftY = Math.cos(t * 0.22) * h * 0.01 + (bass - 0.4) * h * 0.01;
    const feedbackZoom = 1.002 + bass * 0.018;
    const feedbackRot = Math.sin(t * 0.35) * 0.002 + (highs - 0.4) * 0.006;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.94;
    ctx.translate(w / 2 + driftX, h / 2 + driftY);
    ctx.rotate(feedbackRot);
    ctx.scale(feedbackZoom, feedbackZoom);
    ctx.translate(-w / 2, -h / 2);
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.globalAlpha = 0.08 + highs * 0.12;
    ctx.fillStyle = "rgba(4, 10, 18, 1)";
    ctx.fillRect(0, 0, w, h);

    const minSide = Math.min(w, h);
    const depth = 5;
    const branchLength = minSide * (0.13 + bass * 0.12);
    const spread = 0.36 + mids * 0.6;
    const shrink = 0.69 + highs * 0.07;
    const bend = Math.sin(t * 0.9) * 0.18 + (mids - 0.45) * 0.3;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    const edgeRoots = [
      { x: w * 0.18, y: h, angle: Math.PI * (1.04 + bass * 0.03) },
      { x: w * 0.5, y: h, angle: Math.PI * (1 + Math.sin(t * 0.3) * 0.04) },
      { x: w * 0.82, y: h, angle: Math.PI * (0.96 - bass * 0.03) },
      { x: 0, y: h * 0.3, angle: Math.PI * (0.41 + mids * 0.06) },
      { x: w, y: h * 0.7, angle: Math.PI * (1.59 - mids * 0.06) },
    ];

    for (let i = 0; i < edgeRoots.length; i++) {
      const root = edgeRoots[i];
      ctx.save();
      ctx.translate(root.x, root.y);
      ctx.rotate(root.angle + Math.sin(t * 0.4 + i) * 0.08);
      ctx.strokeStyle = clrUtils.getHSL(getStormHue(-12 + i * 5), 70, 76 + i * 3);
      ctx.globalAlpha = 0.08 + bass * 0.1 + i * 0.015;
      ctx.lineWidth = Math.max(1.1, minSide * (0.0013 + bass * 0.0024));
      const isSideRoot = i >= 3;
      const rootLengthMul = isSideRoot ? 1.28 : 0.85 + i * 0.06;
      drawBranch(ctx, depth, branchLength * rootLengthMul, spread, shrink, bend);
      ctx.restore();
    }

    const gridCols = 6;
    const gridRows = 4;
    const cellW = w / gridCols;
    const cellH = h / gridRows;
    const cellSize = Math.min(cellW, cellH) * (0.14 + highs * 0.1);

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const progress = (row * gridCols + col) / (gridCols * gridRows);
        const x = cellW * (col + 0.5) + Math.sin(t * 0.7 + row) * cellW * 0.08;
        const y = cellH * (row + 0.5) + Math.cos(t * 0.6 + col) * cellH * 0.08;
        const rotation = t * (0.18 + progress * 0.15) + mids * 2.5 + col * 0.22;
        const wobble = Math.sin(t * 1.1 + progress * 8) * 0.35 * highs;
        ctx.strokeStyle = clrUtils.getHSL(getStormHue(-18 + progress * 16), 58, 58 + row * 6);
        ctx.globalAlpha = 0.03 + highs * 0.035 + row * 0.008;
        ctx.lineWidth = Math.max(0.9, minSide * (0.0008 + progress * 0.0006));
        drawGridCell(ctx, x, y, cellSize, rotation, wobble);
      }
    }

    const sweepCount = 14;
    for (let i = 0; i < sweepCount; i++) {
      const bin = Math.floor((i / sweepCount) * binCount);
      const level = frequencyData[bin] / 255;
      const y = h * (i / (sweepCount - 1));
      const sweep = w * (0.18 + level * 0.5 + bass * 0.08);
      ctx.beginPath();
      ctx.moveTo(-sweep * 0.15, y);
      ctx.bezierCurveTo(
        w * 0.28,
        y - sweep * 0.08,
        w * 0.72,
        y + sweep * 0.08,
        w + sweep * 0.15,
        y
      );
      ctx.strokeStyle = clrUtils.getHSL(getStormHue(-22 + i * 2), 72, 72);
      ctx.globalAlpha = 0.018 + level * 0.05;
      ctx.lineWidth = Math.max(0.8, minSide * (0.0007 + level * 0.002));
      ctx.stroke();
    }

    const flakeCount = 70;
    for (let i = 0; i < flakeCount; i++) {
      const progress = i / flakeCount;
      const wind = w * (0.035 + mids * 0.04);
      const x =
        ((progress * w * 1.37 + t * wind * (0.65 + progress)) % (w + 80)) - 40;
      const y =
        ((progress * h * 2.1 + t * h * (0.08 + highs * 0.08 + (i % 5) * 0.004)) %
          (h + 60)) -
        30;
      const drift = Math.sin(t * 1.4 + i * 1.7) * (12 + highs * 18);
      const radius = 0.8 + (i % 4) * 0.45 + highs * 1.5;
      ctx.beginPath();
      ctx.arc(x + drift, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = i % 5 === 0 ? "rgba(220, 244, 255, 0.9)" : "rgba(205, 232, 255, 0.72)";
      ctx.globalAlpha = 0.12 + highs * 0.12 + (i % 3) * 0.02;
      ctx.fill();
    }

    ctx.restore();

    const wash = ctx.createLinearGradient(0, 0, w, h);
    wash.addColorStop(0, `hsla(${getStormHue(-10)}, 78%, 34%, ${0.02 + bass * 0.03})`);
    wash.addColorStop(0.5, `hsla(${getStormHue(8)}, 62%, 18%, 0.012)`);
    wash.addColorStop(1, "rgba(3, 7, 14, 0.42)");
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 1;
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";

    requestNextFrame(start);
  };

  return { start, stop };
};

const cssStyle: CSSProperties = {
  filter: "contrast(1.06) saturate(1.12) brightness(0.8)",
};

const MilkdropFractalAnimation = { getAnimateFunc, cssStyle };
export default MilkdropFractalAnimation;
