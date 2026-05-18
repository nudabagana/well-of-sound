import { useEffect, useState } from "react";

const useAnalyserFromMediaStream = (stream?: MediaStream | null) => {
  const [analyser, setAnalyser] = useState<AnalyserNode>();

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
      setAnalyser(undefined);
      return;
    }

    const audioCtx = new AudioContext();
    const streamSource = audioCtx.createMediaStreamSource(stream);
    const nextAnalyser = audioCtx.createAnalyser();
    streamSource.connect(nextAnalyser);
    setAnalyser(nextAnalyser);

    return () => {
      setAnalyser(undefined);
      audioCtx.close();
    };
  }, [stream]);

  return analyser;
};

export default useAnalyserFromMediaStream;
