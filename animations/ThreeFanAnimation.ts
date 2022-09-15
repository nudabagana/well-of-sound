import { CSSProperties } from "react";
import { AnimationProps, GetFuncType } from "../types/AnimationTypes";
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
const PI_OF_4 = Math.PI / 4;

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }, params) => {
  const { setId, stop, bufferLength, dataArr, startMs } = AnimationBase.getBase(
    analyser,
    BAR_COUNT
  );

  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 1.5;
  ctx.globalCompositeOperation = "xor";

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArr);
    const barWidth = (canvas.width + canvas.height) / bufferLength;
    const baseBarHeight = Math.min(canvas.width, canvas.height) / 2;
    const baseBarHeightOf2 = baseBarHeight / 2;
    const baseBarHeightOf1point2 = baseBarHeight / 1.2;
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
      const clrBar = clrUtils.getHSL(h, S, l);
      ctx.fillStyle = clrBar;
      ctx.shadowColor = clrBar;
      ctx.fillRect(0, 0, barWidth, barHeight);
      const clrArc = clrUtils.getHSL(h + 30, S, l);
      ctx.fillStyle = clrArc;
      ctx.shadowColor = clrArc;
      ctx.beginPath();
      ctx.arc(
        5,
        baseBarHeightOf2 * barHeightPrc,
        baseBarHeightOf1point2 * barHeightPrc,
        0,
        PI_OF_4
      );
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
  filter: "brightness(1.2)",
};

const ThreeFanAnimation = { getAnimateFunc, cssStyle };
export default ThreeFanAnimation;
