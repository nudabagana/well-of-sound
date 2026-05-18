import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Animations } from "../animations/AnimationList";
import PlayerControls from "../components/player/PlayerControls";
import PlayerInfoBar from "../components/player/PlayerInfoBar";
import TrackList from "../components/player/TrackList";
import Visualizer from "../components/Visualizer";
import useAnalyserFromAudioElement from "../hooks/useAnalyserFromAudioElement";
import { MainContainer } from "../styled/containers/MainContainer";
import FlexDiv from "../styled/FlexDiv";
import { Animation } from "../types/AnimationTypes";
import { AudioFile } from "../types/FileTypes";
import { randomInt } from "../utils/mathUtls";
import { getUrlParam } from "../utils/urlUtils";

const INITIAL_FILE: AudioFile = {
  id: "hug-a-turtle",
  name: "Hug a Turtle",
  url: "/Parry_Gripp_Hug_A_Turtle.mp3",
};

const DEFAULT_ANIMATION = Animations[0];

const Home: NextPage = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([INITIAL_FILE]);
  const [currFile, setCurrFile] = useState<AudioFile>();
  const [animation, setAnimation] = useState<Animation | undefined>(
    DEFAULT_ANIMATION,
  );
  const [player, setPlayer] = useState<HTMLAudioElement>();
  const analyser = useAnalyserFromAudioElement(player);

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
    if (currFile) {
      if (!player) {
        setPlayer(new Audio());
      } else {
        player.src = currFile.url;
        player.play();
      }
    }
  }, [currFile, player]);

  return (
    <MainContainer>
      <FlexDiv $column>
        <PlayerControls
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
      <FlexDiv $column $flex1>
        <PlayerInfoBar songName={currFile?.name} />
        <Visualizer analyser={analyser} animation={animation} />
      </FlexDiv>
    </MainContainer>
  );
};

export default Home;
