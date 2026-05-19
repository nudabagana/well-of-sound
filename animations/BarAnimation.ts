import { CSSProperties } from "react";
import { AnimationProps, GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase, {
  applyFrameFade,
  FULL_HUE_ROTATION,
  MAX_BYTE_VALUE,
  resizeCanvas,
} from "./AnimationBase";

const FFT_SIZE = 512;
const TIME_STEP_MS = 200;
const LIGHTNESS = 50;
const BASE_SATURATION = 30;
const VARIABLE_SATURATION = 70;
const MAX_RENDERED_BIN_RATIO = 0.7;
const RISE_EASE = 0.5;
const FALL_EASE = 0.25;
const FADE_OUT_FRAMES = 8;

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }) => {
  const {
    requestNextFrame,
    stop,
    binCount,
    readFrequencyData,
    getFrameTime,
  } = AnimationBase.getBase(analyser, FFT_SIZE, MAX_RENDERED_BIN_RATIO);

  const hueStep = FULL_HUE_ROTATION / binCount;
  const displayedLevels = new Float32Array(binCount);

  const start = () => {
    resizeCanvas(canvas);
    const barWidth = canvas.width / binCount / 2;
    const { deltaMs, elapsedMs } = getFrameTime();
    const timeStep = Math.floor(elapsedMs / TIME_STEP_MS);
    let x = 0;
    applyFrameFade(ctx, canvas, deltaMs, FADE_OUT_FRAMES);
    const frequencyData = readFrequencyData();
    const halfCanvasW = canvas.width / 2;

    for (let i = 0; i < binCount; i++) {
      const targetLevel = frequencyData[i] / MAX_BYTE_VALUE;
      const easing = targetLevel > displayedLevels[i] ? RISE_EASE : FALL_EASE;
      displayedLevels[i] += (targetLevel - displayedLevels[i]) * easing;
      const level = displayedLevels[i];

      const h = (timeStep + i * hueStep) % FULL_HUE_ROTATION;
      const s = BASE_SATURATION + VARIABLE_SATURATION * level;
      ctx.fillStyle = clrUtils.getHSL(h, s, LIGHTNESS);
      const y = canvas.height * (1 - level);

      ctx.fillRect(halfCanvasW + x, y, barWidth, canvas.height);
      ctx.fillRect(halfCanvasW - x, y, barWidth, canvas.height);
      x += barWidth;
    }
    requestNextFrame(start);
  };

  return { start, stop };
};

const cssStyle: CSSProperties = {
  filter: "blur(2px)"
};
const BarAnimation = { getAnimateFunc, cssStyle };
export default BarAnimation;
