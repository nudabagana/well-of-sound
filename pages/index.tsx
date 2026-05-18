import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Animations } from "../animations/AnimationList";
import ShareInfoBar from "../components/share/ShareInfoBar";
import Visualizer from "../components/Visualizer";
import useAnalyserFromMediaStream from "../hooks/useAnalyserFromMediaStream";
import useSharedAudioStream from "../hooks/useSharedAudioStream";
import { MainContainer } from "../styled/containers/MainContainer";
import FlexDiv from "../styled/FlexDiv";
import { Animation } from "../types/AnimationTypes";
import { randomInt } from "../utils/mathUtls";
import { getUrlParam } from "../utils/urlUtils";

const DEFAULT_ANIMATION = Animations[0];

const Home: NextPage = () => {
  const [animation, setAnimation] = useState<Animation>(DEFAULT_ANIMATION);
  const { sharedStream, isLoading, onShareAudio } = useSharedAudioStream();
  const analyser = useAnalyserFromMediaStream(sharedStream);

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

  return (
    <MainContainer>
      <FlexDiv $column $flex1>
        <ShareInfoBar
          isSharing={!!sharedStream}
          isLoading={isLoading}
          animationId={animation?.id}
          onAnimationChange={(animationId) =>
            setAnimation(
              Animations.find((item) => item.id === animationId) ??
                DEFAULT_ANIMATION,
            )
          }
          onShare={onShareAudio}
        />
        <Visualizer analyser={analyser} animation={animation} />
      </FlexDiv>
    </MainContainer>
  );
};

export default Home;
