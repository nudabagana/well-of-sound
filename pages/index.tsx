import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animations } from "../animations/AnimationList";
import Controls from "../components/Controls";
import InfoBar from "../components/InfoBar";
import TrackList from "../components/TrackList";
import Visualizer from "../components/Visualizer";
import Button from "../styled/buttons/Button";
import { MainContainer } from "../styled/containers/MainContainer";
import FlexDiv from "../styled/FlexDiv";
import { Animation } from "../types/AnimationTypes";
import { AudioFile } from "../types/FileTypes";
import { randomInt } from "../utils/mathUtls";
import { v4 as uuid } from "uuid";
import { getUrlParam } from "../utils/urlUtils";

const INITIAL_FILE: AudioFile = {
  id: uuid(),
  name: "Hug a Turtle",
  url: "/Parry_Gripp_Hug_A_Turtle.mp3",
};

const Home: NextPage = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([INITIAL_FILE]);
  const [currFile, setCurrFile] = useState<AudioFile>();
  const [animation, setAnimation] = useState<Animation | undefined>(() => {
    const animation = Animations.find((a) => a.id === getUrlParam("animation"));
    return animation ?? Animations[randomInt(Animations.length)];
  });
  const [player, setPlayer] = useState<HTMLAudioElement>();
  const [captureStream, setCaptureStream] = useState<MediaStream | null>(null);
  const [captureStatus, setCaptureStatus] = useState<string>();
  const [captureMode, setCaptureMode] = useState<"share" | "mic" | null>(null);
  const [inputLevel, setInputLevel] = useState(0);
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>("");

  useEffect(() => {
    if (currFile) {
      if (!player) {
        setPlayer(new Audio());
      } else {
        player.src = currFile.url;
        player.play();
      }
    }
  }, [currFile, player]);

  const refreshMicDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return;
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter((device) => device.kind === "audioinput");
    setMicDevices(audioInputs);
    if (!selectedMicId && audioInputs[0]?.deviceId) {
      setSelectedMicId(audioInputs[0].deviceId);
    }
  }, [selectedMicId]);

  useEffect(() => {
    refreshMicDevices();
  }, [refreshMicDevices]);

  const stopCapture = () => {
    captureStream?.getTracks().forEach((track) => track.stop());
    setCaptureStream(null);
    setCaptureMode(null);
    setInputLevel(0);
    setCaptureStatus(undefined);
  };

  const startCapture = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setCaptureStatus("Display audio capture is not supported here.");
      return;
    }

    try {
      stopCapture();
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
        systemAudio: "include",
        preferCurrentTab: false,
      } as any);

      if (stream.getAudioTracks().length === 0) {
        stream.getTracks().forEach((track) => track.stop());
        setCaptureStatus("No audio shared. Retry and enable Share audio.");
        return;
      }

      stream.getTracks().forEach((track) => {
        track.addEventListener(
          "ended",
          () => {
            setCaptureStream(null);
            setCaptureStatus(undefined);
          },
          { once: true }
        );
      });

      setCaptureStream(stream);
      setCaptureMode("share");
      setCaptureStatus("Using shared audio for visualizer.");
    } catch (error) {
      setCaptureStatus("Capture cancelled or failed.");
    }
  };

  const startMicCapture = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCaptureStatus("Microphone capture is not supported here.");
      return;
    }

    try {
      stopCapture();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedMicId ? { exact: selectedMicId } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });

      refreshMicDevices();
      stream.getTracks().forEach((track) => {
        track.addEventListener(
          "ended",
          () => {
            setCaptureStream(null);
            setCaptureMode(null);
            setCaptureStatus(undefined);
          },
          { once: true }
        );
      });

      setCaptureStream(stream);
      setCaptureMode("mic");
      setCaptureStatus("Using microphone for visualizer.");
    } catch (error) {
      setCaptureStatus("Microphone capture cancelled or failed.");
    }
  };

  return (
    <MainContainer>
      <FlexDiv column>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <Button onClick={captureStream ? stopCapture : startCapture}>
            {captureStream ? "Stop capture" : "Capture shared audio"}
          </Button>
          <Button
            onClick={
              captureStream && captureMode === "mic"
                ? stopCapture
                : startMicCapture
            }
          >
            {captureStream && captureMode === "mic"
              ? "Stop mic"
              : "Capture microphone"}
          </Button>
          {captureStream && <span>Input: {inputLevel}%</span>}
          {captureStatus && <span>{captureStatus}</span>}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <span>Mic</span>
          <select
            value={selectedMicId}
            onChange={(e) => setSelectedMicId(e.target.value)}
            onFocus={refreshMicDevices}
            style={{ maxWidth: "280px" }}
          >
            {micDevices.length === 0 && <option value="">Default</option>}
            {micDevices.map((device, i) => (
              <option value={device.deviceId} key={device.deviceId}>
                {device.label || `Microphone ${i + 1}`}
              </option>
            ))}
          </select>
        </div>
        <Controls
          currFile={currFile}
          setAudioFiles={setAudioFiles}
          setCurrFile={setCurrFile}
          player={player}
          setAnimation={setAnimation}
          animation={animation}
          audioFiles={audioFiles}
        />
        <TrackList
          setCurrFile={setCurrFile}
          audioFiles={audioFiles}
          currFile={currFile}
        />
      </FlexDiv>
      <FlexDiv column flex1>
        <InfoBar
          songName={
            captureMode === "mic"
              ? "Microphone"
              : captureMode === "share"
              ? "Shared audio"
              : currFile?.name
          }
        />
        <Visualizer
          player={player}
          mediaStream={captureStream}
          mediaStreamGain={captureMode === "mic" ? 2 : 1}
          onLevel={setInputLevel}
          animation={animation}
        />
      </FlexDiv>
    </MainContainer>
  );
};

export default Home;
