import { CSSProperties } from "react";
import { AnimationProps } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase from "./AnimationBase";

const BAR_COUNT = 256;
const S = 100;
const DEG = 118;
const RADS = (DEG * Math.PI) / 180;
const HUE1 = 295;
const HUE2 = 166;
const HUE3 = 238;
const HUE_MUL = 0.47;

const getAnimateFunc = (
  { ctx, analyser, canvas }: AnimationProps,
  params: any
) => {
  const { setId, stop, bufferLength, dataArr, startMs } = AnimationBase.getBase(
    analyser,
    BAR_COUNT
  );

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArr);
    const barWidth = (canvas.width + canvas.height) / bufferLength;
    const baseBarHeight = Math.min(canvas.width, canvas.height) / 2;
    const halfCanvasW = canvas.width / 2;
    const halfCanvasH = canvas.height / 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeightPrc = dataArr[i] / 255;
      const barHeight = baseBarHeight * barHeightPrc;
      ctx.save();
      ctx.translate(halfCanvasW, halfCanvasH);
      ctx.rotate(i * RADS);
      const h = (i % 3 === 1 ? HUE1 : i % 3 === 2 ? HUE2 : HUE3) + i * HUE_MUL;
      const l = 100 * barHeightPrc;
      ctx.fillStyle = clrUtils.getHSL(h, S, l);
      ctx.fillRect(0, 0, barWidth, barHeight);
      ctx.fillStyle = clrUtils.getHSL(h + 30, S, l);
      ctx.beginPath();
      ctx.arc(5, barHeight / 2, barHeight / 1.2, 0, Math.PI / 4);
      ctx.fill();
      ctx.stroke();

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

const ThreeFanAnimation = { getAnimateFunc, cssStyle };
export default ThreeFanAnimation;
