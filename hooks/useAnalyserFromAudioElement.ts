import { useEffect, useState } from "react";

const useAnalyserFromAudioElement = (player?: HTMLAudioElement | null) => {
  const [analyser, setAnalyser] = useState<AnalyserNode>();

  useEffect(() => {
    if (!player) {
      setAnalyser(undefined);
      return;
    }

    const audioCtx = new AudioContext();
    const audioSource = audioCtx.createMediaElementSource(player);
    const nextAnalyser = audioCtx.createAnalyser();
    audioSource.connect(nextAnalyser);
    nextAnalyser.connect(audioCtx.destination);
    setAnalyser(nextAnalyser);

    return () => {
      setAnalyser(undefined);
      audioCtx.close();
    };
  }, [player]);

  return analyser;
};

export default useAnalyserFromAudioElement;
