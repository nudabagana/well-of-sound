import type { NextPage } from "next";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Controls from "../components/Controls";
import TrackList from "../components/TrackList";
import Visualizer from "../components/Visualizer";
import FlexDiv from "../styles/FlexDiv";
import utils from "../utils/HomeUtils";

const { setNewSong, pause, play } = utils;

const Home: NextPage = () => {
  const [audioFiles, setAudioFiles] = useState<File[]>();
  const [currFile, setCurrFile] = useState<File>();
  const [player, setPlayer] = useState<HTMLAudioElement>();
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!player) {
      return;
    }
    player.volume = volume / 100;
  }, [volume, player]);

  useEffect(() => {
    if (!player) {
      return;
    }
    player.onended = () =>
      play({
        player,
        setCurrFile,
        audioFiles,
        currFile: undefined,
        setIsPlaying,
        setPlayer,
        canvas: canvasRef.current,
      });
  }, [player, audioFiles]);

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArr = [...files];
      setAudioFiles((existingFiles) =>
        existingFiles ? [...existingFiles, ...filesArr] : filesArr
      );
    }
  };

  const clearFiles = () => setAudioFiles(undefined);

  return (
    <FlexDiv style={{ gap: "20px", flex: 1, padding: "10px" }}>
      <FlexDiv column>
        <Controls
          clearFiles={clearFiles}
          onFiles={onFiles}
          play={() =>
            play({
              player,
              setCurrFile,
              audioFiles,
              currFile,
              setIsPlaying,
              setPlayer,
              canvas: canvasRef.current,
            })
          }
          pause={() => pause({ player, setIsPlaying })}
          volume={{ val: volume, set: setVolume }}
          isPlaying={isPlaying}
          player={player}
        />
        <TrackList
          canvas={canvasRef.current}
          play={play}
          setCurrFile={setCurrFile}
          setIsPlaying={setIsPlaying}
          setNewSong={setNewSong}
          setPlayer={setPlayer}
          audioFiles={audioFiles}
          currFile={currFile}
          player={player}
        />
      </FlexDiv>
      <Visualizer canvasRef={canvasRef} />
    </FlexDiv>
  );
};

export default Home;
