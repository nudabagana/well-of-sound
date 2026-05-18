import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Animations } from "../animations/AnimationList";
import ShareInfoBar from "../components/share/ShareInfoBar";
import Visualizer from "../components/Visualizer";
import useAnalyserFromMediaStream from "../hooks/useAnalyserFromMediaStream";
import useMicrophoneDevices from "../hooks/useMicrophoneDevices";
import useMicrophoneStream from "../hooks/useMicrophoneStream";
import useSharedAudioStream from "../hooks/useSharedAudioStream";
import { stopMediaStream } from "../media/mediaStreams";
import { MainContainer } from "../styled/containers/MainContainer";
import FlexDiv from "../styled/FlexDiv";
import { Animation } from "../types/AnimationTypes";
import { randomInt } from "../utils/mathUtls";
import { getUrlParam } from "../utils/urlUtils";

const DEFAULT_ANIMATION = Animations[0];

const Home: NextPage = () => {
  const [animation, setAnimation] = useState<Animation>(DEFAULT_ANIMATION);
  const [microphoneDeviceId, setMicrophoneDeviceId] = useState("default");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const microphoneDevices = useMicrophoneDevices();
  const sharedAudio = useSharedAudioStream();
  const microphone = useMicrophoneStream();
  const analyser = useAnalyserFromMediaStream(stream);

  useEffect(() => {
    const animationFromUrl = Animations.find(
      (item) => item.id === getUrlParam("animation"),
    );

    setAnimation(
      animationFromUrl ??
        Animations[randomInt(Animations.length)] ??
        DEFAULT_ANIMATION,
    );
  }, []);

  useEffect(() => {
    return () => {
      stopMediaStream(stream);
    };
  }, [stream]);

  const setActiveStream = useCallback((nextStream: MediaStream | null) => {
    setStream((currentStream) => {
      stopMediaStream(currentStream);

      if (nextStream) {
        nextStream.getTracks().forEach((track) => {
          track.onended = () => setStream(null);
        });
      }

      return nextStream;
    });
  }, []);

  const onShareAudio = async () => {
    stopMediaStream(stream);
    const nextStream = await sharedAudio.start();
    setActiveStream(nextStream);
  };

  const onCaptureMicrophone = async () => {
    stopMediaStream(stream);
    const nextStream = await microphone.start(microphoneDeviceId);
    setActiveStream(nextStream);
  };

  const onMicrophoneDeviceChange = (deviceId: string) => {
    stopMediaStream(stream);
    setStream(null);
    setMicrophoneDeviceId(deviceId);
  };

  return (
    <MainContainer>
      <FlexDiv $column $flex1>
        <ShareInfoBar
          isLoading={sharedAudio.isLoading || microphone.isLoading}
          animationId={animation?.id}
          microphoneDeviceId={microphoneDeviceId}
          microphoneDevices={microphoneDevices}
          onAnimationChange={(animationId) =>
            setAnimation(
              Animations.find((item) => item.id === animationId) ??
                DEFAULT_ANIMATION,
            )
          }
          onMicrophoneDeviceChange={onMicrophoneDeviceChange}
          onShareAudio={onShareAudio}
          onCaptureMicrophone={onCaptureMicrophone}
        />
        <Visualizer analyser={analyser} animation={animation} />
      </FlexDiv>
    </MainContainer>
  );
};

export default Home;
