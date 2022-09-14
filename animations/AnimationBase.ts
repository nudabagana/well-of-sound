import { Analyser } from "../types/AnimationTypes";

const getBase = (analyser: Analyser, barCount: number) => {
  let requestId: number | undefined = undefined;
  const stop = () => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
  };
  const setId = (id: number) => (requestId = id);

  analyser.fftSize = barCount;
  const bufferLength = analyser.frequencyBinCount;
  const dataArr = new Uint8Array(bufferLength);
  const startMs = Date.now();

  return { setId, stop, bufferLength, dataArr, startMs };
};

const AnimationBase = { getBase };
export default AnimationBase;
