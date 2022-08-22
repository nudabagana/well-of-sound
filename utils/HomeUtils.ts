import { Dispatch, SetStateAction } from "react";

type setNewSongProps = {
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

type playProps = {
  player?: HTMLAudioElement;
  audioFiles?: File[];
  currFile?: File;
  setCurrFile: Dispatch<SetStateAction<File | undefined>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setPlayer: Dispatch<SetStateAction<HTMLAudioElement | undefined>>;
  canvas?: HTMLCanvasElement | null;
};

const play = ({
  player,
  audioFiles,
  setCurrFile,
  currFile,
  setIsPlaying,
  canvas,
  setPlayer,
}: playProps) => {
  let playerObj = player;
  if (!audioFiles) {
    return;
  }

  if (!playerObj) {
    playerObj = initialize({ setPlayer, canvas });
  }

  if (!currFile) {
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

const initialize = ({ setPlayer, canvas }: initializeProps) => {
  const player = new Audio();
  player.onended = () => console.log("Song ended");
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

  return player;
};

const exports = { setNewSong, playRandom, pause, play };

export default exports;
