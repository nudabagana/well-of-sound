import { Analyser } from "../types/AnimationTypes";

export const MAX_BYTE_VALUE = 255;
export const FULL_HUE_ROTATION = 360;
export const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
};
export const applyFrameFade = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  deltaMs: number,
  fadeOutFrames: number,
  referenceFps: number = 60
) => {
  if (fadeOutFrames <= 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const targetFrameMs = 1000 / referenceFps;
  const fadeProgress = Math.min(1, deltaMs / (fadeOutFrames * targetFrameMs));
  if (fadeProgress <= 0) {
    return;
  }

  ctx.globalCompositeOperation = "destination-out";
  ctx.globalAlpha = fadeProgress;
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
};

const getBase = (
  analyser: Analyser,
  fftSize: number,
  usedBinRatio: number = 1
) => {
  let requestId: number | undefined = undefined;
  const startMs = Date.now();
  let previousFrameMs = startMs;
  const stop = () => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
  };
  const requestNextFrame = (draw: FrameRequestCallback) => {
    requestId = requestAnimationFrame(draw);
  };

  analyser.fftSize = fftSize;
  const binCount = Math.max(
    1,
    Math.floor(analyser.frequencyBinCount * usedBinRatio)
  );
  const frequencyData = new Uint8Array(binCount);
  const readFrequencyData = () => {
    analyser.getByteFrequencyData(frequencyData);
    return frequencyData;
  };
  const getFrameTime = () => {
    const nowMs = Date.now();
    const deltaMs = nowMs - previousFrameMs;
    previousFrameMs = nowMs;
    return { nowMs, deltaMs, elapsedMs: nowMs - startMs };
  };

  return {
    requestNextFrame,
    stop,
    binCount,
    readFrequencyData,
    startMs,
    getFrameTime,
  };
};

const AnimationBase = { getBase };
export default AnimationBase;
