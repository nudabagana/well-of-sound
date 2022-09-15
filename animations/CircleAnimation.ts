import { CSSProperties } from "react";
import { AnimationProps, GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase from "./AnimationBase";

const BAR_COUNT = 1024;
const L = 50;

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }) => {
  const { setId, stop, bufferLength, dataArr, startMs } = AnimationBase.getBase(
    analyser,
    BAR_COUNT
  );

  const start = () => {
    const passed200Ms = Math.floor((Date.now() - startMs) / 200);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArr);
    const barWidth =
      (Math.min(canvas.width, canvas.height) / bufferLength) * 1.5;
    const halfCanvasW = canvas.width / 2;
    const halfCanvasH = canvas.height / 2;
    const baseBarHeight = Math.min(canvas.width, canvas.height) / 2;

    ctx.save();
    ctx.translate(halfCanvasW, halfCanvasH);
    const deg = 900 / bufferLength;
    const rads = (deg * Math.PI) / 180;
    for (let i = 0; i < bufferLength; i++) {
      const barHeightPrc = dataArr[i] / 255;
      ctx.rotate(rads);

      const h = (passed200Ms + i * 2.8) % 360;
      const s = 100;
      ctx.fillStyle = clrUtils.getHSL(h, s, L);
      ctx.fillRect(0, 0, barWidth, baseBarHeight * barHeightPrc);
    }
    ctx.restore();
    setId(requestAnimationFrame(start));
  };

  return { start, stop };
};

const cssStyle: CSSProperties = {
  filter: "blur(1px) brightness(1.4) contrast(1.2)",
};

const CircleAnimation = { getAnimateFunc, cssStyle };
export default CircleAnimation;
