import { CSSProperties } from "react";
import { AnimationProps, GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase from "./AnimationBase";

const BAR_COUNT = 1024;
const L = 50;
const S = 100;

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }, params) => {
  const { setId, stop, bufferLength, dataArr, startMs } = AnimationBase.getBase(
    analyser,
    BAR_COUNT
  );

  const draw = () => {
    const passed200Ms = Math.floor((Date.now() - startMs) / 200);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArr);
    const barWidth = ((canvas.width + canvas.height) / bufferLength) * 2 * 1.5;
    const baseBarHeight = Math.min(canvas.width, canvas.height) / 2;
    const halfCanvasW = canvas.width / 2;
    const halfCanvasH = canvas.height / 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeightPrc = dataArr[i] / 255;
      ctx.save();
      ctx.translate(halfCanvasW, halfCanvasH);
      ctx.rotate((i * Math.PI * 10) / bufferLength);
      const h = i * 0.3;
      const l = 100 * barHeightPrc;
      ctx.fillStyle = clrUtils.getHSL(h, S, l);
      ctx.fillRect(0, 0, barWidth, baseBarHeight * barHeightPrc);
      x += barWidth;
      ctx.restore();
    }
    setId(requestAnimationFrame(draw));
  };

  return { start: draw, stop };
};

const cssStyle: CSSProperties = {
  filter: "",
};

const NewAnimation = { getAnimateFunc, cssStyle };
export default NewAnimation;
