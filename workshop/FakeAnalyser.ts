import { data128 } from "./AnalyserData";

const create = (barCount: 256) => {
  let fftSize = barCount;
  let frequencyBinCount = fftSize / 2;
  let index = 0;

  const getByteFrequencyData = (array: Uint8Array) => {
    if (index >= data128.length) {
      index = 0;
    }
    array.set(data128[index]);
    index++;
  };
  return { getByteFrequencyData, fftSize, frequencyBinCount };
};

const FakeAnalyser = { create };
export default FakeAnalyser;
