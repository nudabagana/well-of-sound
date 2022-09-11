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

const INITIAL_FILE: AudioFile = {
  id: uuid(),
  name: "Hug a Turtle",
  url: "/Parry_Gripp_Hug_A_Turtle.mp3",
};

const Home: NextPage = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([INITIAL_FILE]);
  const [currFile, setCurrFile] = useState<AudioFile>();
  const [animation, setAnimation] = useState<Animation | undefined>(
    Animations[randomInt(Animations.length)]
  );
  const [player, setPlayer] = useState<HTMLAudioElement>();

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
      <FlexDiv column>
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
        <InfoBar songName={currFile?.name} />
        <Visualizer player={player} animation={animation} />
      </FlexDiv>
    </MainContainer>
  );
};

export default Home;
