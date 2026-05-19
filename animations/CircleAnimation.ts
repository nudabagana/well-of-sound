import { CSSProperties } from "react";
import { AnimationProps, GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase, {
  FULL_HUE_ROTATION,
  resizeCanvas,
} from "./AnimationBase";

const FFT_SIZE = 1024;
const L = 50;

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }) => {
  const { requestNextFrame, stop, binCount, readFrequencyData, startMs } =
    AnimationBase.getBase(analyser, FFT_SIZE);

  const start = () => {
    resizeCanvas(canvas);
    const passed200Ms = Math.floor((Date.now() - startMs) / 200);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const frequencyData = readFrequencyData();
    const barWidth =
      (Math.min(canvas.width, canvas.height) / binCount) * 1.5;
    const halfCanvasW = canvas.width / 2;
    const halfCanvasH = canvas.height / 2;
    const baseBarHeight = Math.min(canvas.width, canvas.height) * 0.7;

    ctx.save();
    ctx.translate(halfCanvasW, halfCanvasH);
    const deg = 900 / binCount;
    const rads = (deg * Math.PI) / 180;
    for (let i = 0; i < binCount; i++) {
      const barHeightPrc = frequencyData[i] / 255;
      ctx.rotate(rads);

      const h = (passed200Ms + i * 2.8) % FULL_HUE_ROTATION;
      const s = 100;
      ctx.fillStyle = clrUtils.getHSL(h, s, L);
      ctx.fillRect(0, 0, barWidth, baseBarHeight * barHeightPrc);
    }
    ctx.restore();
    requestNextFrame(start);
  };

  return { start, stop };
};

const cssStyle: CSSProperties = {
  filter: "blur(1px) brightness(1.4) contrast(1.2)",
};

const CircleAnimation = { getAnimateFunc, cssStyle };
export default CircleAnimation;
