import { Dispatch, SetStateAction } from "react";
import clrUtils from "./clrUtils";

export type setNewSongProps = {
  player?: HTMLAudioElement;
  file: File;
  setCurrFile: Dispatch<SetStateAction<File | undefined>>;
};

const setNewSong = async ({ player, file, setCurrFile }: setNewSongProps) => {
  if (!player) {
    return;
  }
  setCurrFile(file);
  player.src = URL.createObjectURL(file);
};

type randomizeProps = {
  player?: HTMLAudioElement;
  audioFiles?: File[];
  setCurrFile: Dispatch<SetStateAction<File | undefined>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setPlayer: Dispatch<SetStateAction<HTMLAudioElement | undefined>>;
  canvas?: HTMLCanvasElement | null;
};

const playRandom = ({
  player,
  audioFiles,
  setCurrFile,
  setIsPlaying,
  setPlayer,
  canvas,
}: randomizeProps) => {
  let playerObj = player;
  if (!audioFiles) {
    return;
  }

  if (!playerObj) {
    playerObj = initialize({ setPlayer, canvas });
  }

  setNewSong({
    file: audioFiles[Math.floor(Math.random() * audioFiles.length)],
    setCurrFile,
    player: playerObj,
  });

  playerObj.play();
  setIsPlaying(true);
};

type pauseProps = {
  player?: HTMLAudioElement;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
};

const pause = ({ player, setIsPlaying }: pauseProps) => {
  if (!player) {
    return;
  }
  player.pause();
  setIsPlaying(false);
};

export type playProps = {
  player?: HTMLAudioElement;
  audioFiles?: File[];
  currFile?: File;
  setCurrFile: Dispatch<SetStateAction<File | undefined>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setPlayer: Dispatch<SetStateAction<HTMLAudioElement | undefined>>;
  canvas?: HTMLCanvasElement | null;
  songToPlay?: File;
};

const play = ({
  player,
  audioFiles,
  setCurrFile,
  currFile,
  setIsPlaying,
  canvas,
  setPlayer,
  songToPlay,
}: playProps) => {
  let playerObj = player;
  if (!audioFiles) {
    return;
  }

  if (!playerObj) {
    playerObj = initialize({ setPlayer, canvas });
  }

  if (songToPlay) {
    setNewSong({
      file: songToPlay,
      player: playerObj,
      setCurrFile,
    });
  } else if (!currFile) {
    setNewSong({
      file: audioFiles[Math.floor(Math.random() * audioFiles.length)],
      player: playerObj,
      setCurrFile,
    });
  }

  playerObj.play();
  setIsPlaying(true);
};

type initializeProps = {
  setPlayer: Dispatch<SetStateAction<HTMLAudioElement | undefined>>;
  canvas?: HTMLCanvasElement | null;
};

const CLRS = [
  "#ff2c2c",
  "#ffb62a",
  "#d5ff00",
  "#0dff00",
  "#00f0ff",
  "#0011ff",
  "#80f",
  "#ff0067",
];

const initialize = ({ setPlayer, canvas }: initializeProps) => {
  const player = new Audio();
  setPlayer(player);

  const ctx = canvas?.getContext("2d");
  const audioCtx = new AudioContext();
  if (!ctx || !canvas) {
    return player;
  }
  const audioSource = audioCtx.createMediaElementSource(player);
  const analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  const dataArr = new Uint8Array(bufferLength);

  const barWidth = canvas.width / bufferLength;
  const startMS = Date.now();
  ctx.fillStyle = "red";
  let lastChange = 0;

  const animate = () => {
    const passedS = Math.floor((Date.now() - startMS) / 1000);
    if (passedS % 3 === 0 && lastChange !== passedS) {
      ctx.fillStyle = clrUtils.getRandomClr();
      lastChange = passedS;
    }
    let x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArr);

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArr[i] / 255;
      ctx.fillRect(
        x,
        canvas.height * (1 - barHeight),
        barWidth,
        canvas.height
      );
      x += barWidth;
    }
    requestAnimationFrame(animate);
  };
  animate();

  return player;
};

const exports = { setNewSong, playRandom, pause, play };

export default exports;
