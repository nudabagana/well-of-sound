import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Animations } from "../animations/AnimationList";
import Controls from "../components/Controls";
import InfoBar from "../components/InfoBar";
import TrackList from "../components/TrackList";
import Visualizer from "../components/Visualizer";
import { usePlayerContext } from "../context/playerContext";
import { makeHTMLAudioElementPlayer } from "../players/HTMLAudioElement";
import { MainContainer } from "../styled/containers/MainContainer";
import FlexDiv from "../styled/FlexDiv";
import { Animation } from "../types/AnimationTypes";
import { randomInt } from "../utils/mathUtls";
import { getUrlParam } from "../utils/urlUtils";

const Home: NextPage = () => {
  const [animation, setAnimation] = useState<Animation | undefined>(() => {
    const animation = Animations.find((a) => a.id === getUrlParam("animation"));
    return animation ?? Animations[randomInt(Animations.length)];
  });
  const { setPlayer, player } = usePlayerContext();

  useEffect(() => {
    if (!player) {
      setPlayer(makeHTMLAudioElementPlayer());
    }
  }, [player, setPlayer]);

  return (
    <MainContainer>
      <FlexDiv column>
        <Controls setAnimation={setAnimation} animation={animation} />
        <TrackList />
      </FlexDiv>
      <FlexDiv column flex1>
        <InfoBar />
        <Visualizer animation={animation} />
      </FlexDiv>
    </MainContainer>
  );
};

export default Home;
