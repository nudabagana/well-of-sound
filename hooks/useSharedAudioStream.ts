import { useCallback, useEffect, useState } from "react";

const stopStream = (stream?: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop());
};

const useSharedAudioStream = () => {
  const [sharedStream, setSharedStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      stopStream(sharedStream);
    };
  }, [sharedStream]);

  const onShareAudio = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (nextStream.getAudioTracks().length === 0) {
        stopStream(nextStream);
        setSharedStream(null);
        return;
      }

      stopStream(sharedStream);
      nextStream.getTracks().forEach((track) => {
        track.onended = () => {
          setSharedStream(null);
        };
      });

      setSharedStream(nextStream);
    } catch {
      setSharedStream(null);
    } finally {
      setIsLoading(false);
    }
  }, [sharedStream]);

  return { sharedStream, isLoading, onShareAudio };
};

export default useSharedAudioStream;
