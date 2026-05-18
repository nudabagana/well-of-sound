import { useEffect, useState } from "react";

export type MicrophoneDevice = {
  id: string;
  label: string;
};

const DEFAULT_MICROPHONE = {
  id: "default",
  label: "Default microphone",
};

const useMicrophoneDevices = () => {
  const [microphoneDevices, setMicrophoneDevices] = useState<MicrophoneDevice[]>(
    [DEFAULT_MICROPHONE],
  );

  useEffect(() => {
    const updateDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const nextDevices = devices
          .filter((device) => device.kind === "audioinput")
          .map((device, index) => ({
            id: device.deviceId,
            label:
              device.label ||
              `Microphone ${index + 1}${device.deviceId === "default" ? " (Default)" : ""}`,
          }));

        setMicrophoneDevices(
          nextDevices.length > 0 ? nextDevices : [DEFAULT_MICROPHONE],
        );
      } catch {
        setMicrophoneDevices([DEFAULT_MICROPHONE]);
      }
    };

    void updateDevices();
    navigator.mediaDevices.addEventListener("devicechange", updateDevices);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", updateDevices);
    };
  }, []);

  return microphoneDevices;
};

export default useMicrophoneDevices;
