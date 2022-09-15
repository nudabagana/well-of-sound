import { CSSProperties } from "react";
import { AnimationProps, GetFuncType } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase from "./AnimationBase";

const BAR_COUNT = 256;
const FUNC_WEIGHT = 0.3;
const SOUND_WEIGHT = 1 - FUNC_WEIGHT;
const L = 50;

const getAnimateFunc: GetFuncType = ({ ctx, analyser, canvas }) => {
  const { setId, stop, bufferLength, dataArr, startMs } = AnimationBase.getBase(
    analyser,
    BAR_COUNT
  );

  const start = () => {
    const barWidth = canvas.width / bufferLength;
    const passed200Ms = Math.floor((Date.now() - startMs) / 200);
    const halfHeight = canvas.height / 2;
    analyser.getByteFrequencyData(dataArr);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(0, halfHeight);

    let prevX = 0;
    let prevY = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeightPrc = dataArr[i] / 255;
      const widthPrc = i / bufferLength;

      const h = (passed200Ms + i * 2.8) % 360;
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
    setId(requestAnimationFrame(start));
  };

  return { start, stop };
};

const sinFromPrc = (x: number) => Math.sin(x * 2 * Math.PI);

const cssStyle: CSSProperties = {
  filter: "blur(1px) brightness(4)",
};
const FuncAnimation = { getAnimateFunc, cssStyle };
export default FuncAnimation;
