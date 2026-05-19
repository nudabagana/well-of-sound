import { CSSProperties } from "react";
import { AnimationProps, GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase, { resizeCanvas } from "./AnimationBase";

const FFT_SIZE = 256;
const S = 100;
const DEG = 178;
const RADS = (DEG * Math.PI) / 180;
const HUE1 = 295;
const HUE2 = 166;
const HUE_MUL = 0.47;

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }, params) => {
  const { requestNextFrame, stop, binCount, readFrequencyData, startMs } =
    AnimationBase.getBase(analyser, FFT_SIZE);

  const draw = () => {
    resizeCanvas(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const frequencyData = readFrequencyData();
    const barWidth = (canvas.width + canvas.height) / binCount;
    const baseBarHeight = Math.min(canvas.width, canvas.height) / 2;
    const halfCanvasW = canvas.width / 2;
    const halfCanvasH = canvas.height / 2;

    for (let i = 0; i < binCount; i++) {
      const barHeightPrc = frequencyData[i] / 255;
      const barHeight = baseBarHeight * barHeightPrc;
      ctx.save();
      ctx.translate(halfCanvasW, halfCanvasH);
      ctx.rotate(i * RADS);
      const h = (i % 2 === 1 ? HUE1 : HUE2) + i * HUE_MUL;
      const l = 100 * barHeightPrc;
      ctx.fillStyle = clrUtils.getHSL(h, S, l);
      ctx.fillRect(0, 0, barWidth, barHeight);
      ctx.rotate(RADS);
      ctx.fillStyle = clrUtils.getHSL(h + 30, S, l);
      ctx.beginPath();
      ctx.arc(5, barHeight / 2, barHeight / 1.2, 0, Math.PI / 4);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    requestNextFrame(draw);
  };

  return { start: draw, stop };
};

const cssStyle: CSSProperties = {
  filter: "",
};

const TwoFanAnimation = { getAnimateFunc, cssStyle };
export default TwoFanAnimation;
