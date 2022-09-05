import { AnimationProps } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase from "./AnimationBase";

const BAR_COUNT = 256;
const L = 50;

const getAnimateFunc = ({ ctx, analyser, canvas }: AnimationProps) => {
  const { setId, stop } = AnimationBase.getBase();
  analyser.fftSize = BAR_COUNT;
  const bufferLength = analyser.frequencyBinCount;
  const dataArr = new Uint8Array(bufferLength);
  const barWidth = canvas.width / bufferLength / 2;

  const startMS = Date.now();

  const start = () => {
    const passed200Ms = Math.floor((Date.now() - startMS) / 200);
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

const BarAnimation = { getAnimateFunc };
export default BarAnimation;
