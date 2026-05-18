import { useCallback, useState } from "react";
import { stopMediaStream } from "../media/mediaStreams";

const useMicrophoneStream = () => {
  const [isLoading, setIsLoading] = useState(false);

  const start = useCallback(async (deviceId?: string) => {
    setIsLoading(true);

    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        audio:
          deviceId && deviceId !== "default"
            ? { deviceId: { exact: deviceId } }
            : true,
      });

      if (nextStream.getAudioTracks().length === 0) {
        stopMediaStream(nextStream);
        return null;
      }
      return nextStream;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, start };
};

export default useMicrophoneStream;
