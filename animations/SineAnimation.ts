import { CSSProperties } from "react";
import { AnimationProps, GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase, {
  FULL_HUE_ROTATION,
  resizeCanvas,
} from "./AnimationBase";

const FFT_SIZE = 256;
const FUNC_WEIGHT = 0.3;
const SOUND_WEIGHT = 1 - FUNC_WEIGHT;
const L = 50;
const MAX_RENDERED_BIN_RATIO = 0.7;

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }) => {
  const { requestNextFrame, stop, binCount, readFrequencyData, startMs } =
    AnimationBase.getBase(
    analyser,
    FFT_SIZE,
    MAX_RENDERED_BIN_RATIO
  );

  const start = () => {
    resizeCanvas(canvas);
    const barWidth = canvas.width / binCount;
    const passed200Ms = Math.floor((Date.now() - startMs) / 200);
    const halfHeight = canvas.height / 2;
    const frequencyData = readFrequencyData();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(0, halfHeight);

    let prevX = 0;
    let prevY = 0;
    for (let i = 0; i < binCount; i++) {
      const barHeightPrc = frequencyData[i] / 255;
      const widthPrc = i / binCount;

      const h = (passed200Ms + i * 2.8) % FULL_HUE_ROTATION;
      const s = 50 + 50 * barHeightPrc;
      ctx.strokeStyle = clrUtils.getHSL(h, s, L);

      const x = i * barWidth;
      const y =
        (sinFromPrc(widthPrc) * FUNC_WEIGHT +
          sinFromPrc(barHeightPrc) * SOUND_WEIGHT) *
        halfHeight;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
      prevX = x;
      prevY = y;
    }
    ctx.restore();
    requestNextFrame(start);
  };

  return { start, stop };
};

const sinFromPrc = (x: number) => Math.sin(x * 2 * Math.PI);

const cssStyle: CSSProperties = {
  filter: "blur(1px) brightness(4)",
};
const FuncAnimation = { getAnimateFunc, cssStyle };
export default FuncAnimation;
