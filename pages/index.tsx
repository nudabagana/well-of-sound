import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Animations } from "../animations/AnimationList";
import Controls from "../components/Controls";
import InfoBar from "../components/InfoBar";
import TrackList from "../components/TrackList";
import Visualizer from "../components/Visualizer";
import { MainContainer } from "../styled/containers/MainContainer";
import FlexDiv from "../styled/FlexDiv";
import { Animation } from "../types/AnimationTypes";
import { AudioFile } from "../types/FileTypes";
import { randomInt } from "../utils/mathUtls";
import { v4 as uuid } from "uuid";
import { getUrlParam } from "../utils/urlUtils";
import { Player } from "../types/PlayerTypes";
import { makeHTMLAudioElementPlayer } from "../players/HTMLAudioElement";

const Home: NextPage = () => {
  const [animation, setAnimation] = useState<Animation | undefined>(() => {
    const animation = Animations.find((a) => a.id === getUrlParam("animation"));
    return animation ?? Animations[randomInt(Animations.length)];
  });
  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    if (!player) {
      setPlayer(makeHTMLAudioElementPlayer());
    }
    // if (currFile) {
    //   if (!player) {
    //     setPlayer(makeHTMLAudioElementPlayer());
    //   } else {
    //     player.src = currFile.url;
    //     player.play();
    //   }
    // }
  }, [player]);

  return (
    <MainContainer>
      <FlexDiv column>
        <Controls
          player={player}
          setAnimation={setAnimation}
          animation={animation}
        />
        <TrackList player={player} />
      </FlexDiv>
      <FlexDiv column flex1>
        <InfoBar songName={undefined} />
        <Visualizer player={player?.htmlAudioElement} animation={animation} />
      </FlexDiv>
    </MainContainer>
  );
};

export default Home;
