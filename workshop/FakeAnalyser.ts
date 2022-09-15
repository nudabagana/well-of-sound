import { data128, data512 } from "./AnalyserData";

const dataMap = { 256: data128, 1024: data512 };

const create = (fftS: 256 | 1024) => {
  let fftSize = fftS;
  let frequencyBinCount = fftSize / 2;
  let index = 0;

  const data = dataMap[fftS];
  const getByteFrequencyData = (array: Uint8Array) => {
    if (index >= data.length) {
      index = 0;
    }
    array.set(data[index]);
    index++;
  };
  return { getByteFrequencyData, fftSize, frequencyBinCount };
};

const FakeAnalyser = { create };
export default FakeAnalyser;
