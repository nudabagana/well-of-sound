import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Controls from "../components/Controls";
import utils from "../utils/HomeUtils";

const { setNewSong, pause, play } = utils;

const Home: NextPage = () => {
  const [audioFiles, setAudioFiles] = useState<File[]>();
  const [currFile, setCurrFile] = useState<File>();
  const [player, setPlayer] = useState<HTMLAudioElement>();
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  canvasRef.current;

  useEffect(() => {
    if (!player) {
      return;
    }
    player.volume = volume / 100;
  }, [volume, player]);

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
    <div>
      <Head>
        <title>Well of Sound</title>
        <meta name="description" content="Music visualizer." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            height: "400px",
            width: "400px",
            overflow: "auto",
            border: "solid 3px black",
            background: "##ccd7e8",
            padding: "5px",
          }}
        >
          {audioFiles?.map((file, i) => {
            const { name } = file;
            return (
              <div
                key={name}
                onDoubleClick={() =>
                  setNewSong({ file, player, setCurrFile }).then(() =>
                    play({
                      player,
                      setCurrFile,
                      audioFiles,
                      currFile,
                      setIsPlaying,
                      setPlayer,
                      canvas: canvasRef.current,
                    })
                  )
                }
                style={{
                  backgroundColor:
                    file.name === currFile?.name ? "cyan" : undefined,
                }}
              >
                {i} - {name}
              </div>
            );
          })}
        </div>
        <div style={{ border: "solid 3px black", width: "100%" }}>
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", paddingTop: "20px" }}
          ></canvas>
        </div>
      </div>
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
      />
    </div>
  );
};

export default Home;
