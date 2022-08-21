import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [audioFiles, setAudioFiles] = useState<File[]>();
  const [currFile, setCurrFile] = useState<File>();
  const [player, setPlayer] = useState<HTMLAudioElement>();
  const [volume, setVolume] = useState(50);
  const [init, setInit] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!init) {
      return;
    }

    const player = new Audio();
    player.onended = () => console.log("Song ended");
    setPlayer(player);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const audioCtx = new AudioContext();
    if (!ctx || !player || !canvas) {
      return;
    }
    const audioSource = audioCtx.createMediaElementSource(player);
    const analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArr = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x = 0;

    const animate = () => {
      x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArr);
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArr[i];
        ctx.fillStyle = "cyan";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [init]);

  useEffect(() => {
    if (!player) {
      return;
    }
    player.volume = volume / 100;
  }, [volume, player]);

  const setNewSong = async (file: File) => {
    if (!player) {
      return;
    }
    setCurrFile(file);
    const url = URL.createObjectURL(file);
    player.src = url;
  };

  const play = async () => {
    if (!audioFiles || !player) {
      return;
    }
    if (!currFile) {
      setNewSong(audioFiles[Math.floor(Math.random() * audioFiles.length)]);
    }
    player.play();
  };

  const randomize = () => {
    if (!audioFiles || !player) {
      return;
    }
    setNewSong(audioFiles[Math.floor(Math.random() * audioFiles.length)]);

    player.play();
  };

  const pause = () => {
    if (!player) {
      return;
    }
    player.pause();
  };

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArr = [...files];
      setAudioFiles((existingFiles) =>
        existingFiles ? [...existingFiles, ...filesArr] : filesArr
      );
    }
  };

  return (
    <div className={styles.container}>
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
                onDoubleClick={() => setNewSong(file).then(() => play())}
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
      <input
        type="file"
        name="myImage"
        accept="*"
        multiple
        onChange={onFiles}
        onClick={(event) => {
          if (event.target instanceof HTMLInputElement) {
            event.target.value = "";
          }
        }}
      />
      <button
        style={{
          margin: "30px",
          fontSize: "20px",
          padding: "5px 60px",
        }}
        onClick={() => setAudioFiles(undefined)}
      >
        Clear files
      </button>
      <button
        style={{
          margin: "30px",
          fontSize: "20px",
          padding: "5px 60px",
        }}
        onClick={play}
      >
        Play!
      </button>
      <button
        style={{
          margin: "30px",
          fontSize: "20px",
          padding: "5px 60px",
        }}
        onClick={pause}
      >
        Pause..
      </button>
      <button onClick={() => setInit(true)}>Innit</button>
      <p>Volume - {volume}%</p>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
    </div>
  );
};

export default Home;

const getRandomClr = () => {
  const o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    r().toFixed(1) +
    ")"
  );
};
