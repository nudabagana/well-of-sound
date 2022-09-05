import { AnimationProps } from "../types/AnimationTypes";
import clrUtils from "../utils/clrUtils";
import AnimationBase from "./AnimationBase";

const getAnimateFunc = ({ ctx, analyser, canvas }: AnimationProps) => {
  const { setId, stop } = AnimationBase.getBase();
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  const dataArr = new Uint8Array(bufferLength);
  const barWidth = canvas.width / bufferLength;

  let lastChange = 0;
  const startMS = Date.now();

  const start = () => {
    const passedS = Math.floor((Date.now() - startMS) / 1000);
    if (passedS % 3 === 0 && lastChange !== passedS) {
      ctx.fillStyle = clrUtils.getRandomClr();
      lastChange = passedS;
    }
    let x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArr);

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArr[i] / 255;
      ctx.fillRect(x, canvas.height * (1 - barHeight), barWidth, canvas.height);
      x += barWidth;
    }
    setId(requestAnimationFrame(start));
  };

  return { start, stop };
};

const BarAnimation = { getAnimateFunc };
export default BarAnimation;
