import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Animations } from "../animations/AnimationList";
import Controls from "../components/Controls";
import TrackList from "../components/TrackList";
import Visualizer from "../components/Visualizer";
import FlexDiv from "../styles/FlexDiv";
import { Animation } from "../types/AnimationTypes";
import { FileWithId } from "../types/FileTypes";

const Home: NextPage = () => {
  const [audioFiles, setAudioFiles] = useState<FileWithId[]>([]);
  const [currFile, setCurrFile] = useState<FileWithId>();
  const [animation, setAnimation] = useState<Animation | undefined>(
    Animations[0]
  );
  const playerRef = useRef<HTMLAudioElement>(null);
  const player = playerRef.current;

  useEffect(() => {
    if (player && currFile) {
      player.src = URL.createObjectURL(currFile.file);
      player.play();
    }
  }, [currFile, player]);

  return (
    <FlexDiv style={{ gap: "20px", flex: 1, padding: "10px" }}>
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
      <Visualizer player={player} animation={animation} />
      <audio ref={playerRef} style={{ display: "none" }} />
    </FlexDiv>
  );
};

export default Home;
