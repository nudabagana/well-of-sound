import { CSSProperties } from "react";
import { AnimationProps, GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase from "./AnimationBase";

const BAR_COUNT = 256;
const L = 50;

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }) => {
  const { setId, stop, bufferLength, dataArr, startMs } = AnimationBase.getBase(
    analyser,
    BAR_COUNT
  );

  const start = () => {
    const barWidth = canvas.width / bufferLength / 2;
    const passed200Ms = Math.floor((Date.now() - startMs) / 200);
    let x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArr);
    const halfCanvasW = canvas.width / 2;

    for (let i = 0; i < bufferLength; i++) {
      const barHeightPrc = dataArr[i] / 255;
      const h = (passed200Ms + i * 2.8) % 360;
      const s = 30 + 70 * barHeightPrc;
      ctx.fillStyle = clrUtils.getHSL(h, s, L);
      const y = canvas.height * (1 - barHeightPrc);

      ctx.fillRect(halfCanvasW + x, y, barWidth, canvas.height);
      ctx.fillRect(halfCanvasW - x, y, barWidth, canvas.height);
      x += barWidth;
    }
    setId(requestAnimationFrame(start));
  };

  return { start, stop };
};

const cssStyle: CSSProperties = {};
const BarAnimation = { getAnimateFunc, cssStyle };
export default BarAnimation;
