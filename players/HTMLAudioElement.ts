import { AudioFile } from "../types/FileTypes";
import { Player, VoidOrNull } from "../types/PlayerTypes";
import { randomInt } from "../utils/mathUtls";
import { v4 as uuid } from "uuid";

const INITIAL_FILE: AudioFile = {
  id: uuid(),
  name: "Hug a Turtle",
  url: "/Parry_Gripp_Hug_A_Turtle.mp3",
};

export const makeHTMLAudioElementPlayer = (shuffle: boolean = true): Player => {
  let audio = new Audio();

  let audioFiles: AudioFile[] = [INITIAL_FILE];
  let shuffling = shuffle;
  let currFile: AudioFile | null = null;

  let onDurationChangeF: VoidOrNull = null;
  let onPlayF: VoidOrNull = null;
  let onPauseF: VoidOrNull = null;
  let onTrackChangeF: ((name: string) => void) | null = null;
  let onTracksChangeF: VoidOrNull = null;

  let switchSong = () => {
    let nextFile =
      shuffle || !currFile
        ? audioFiles[randomInt(audioFiles.length)]
        : audioFiles[currFile ? audioFiles.indexOf(currFile) + 1 : 0];

    if (nextFile === currFile) {
      nextFile =
        audioFiles[audioFiles.indexOf(currFile) + 1] ??
        audioFiles[audioFiles.indexOf(currFile) - 1];
    }
    if (nextFile) {
      currFile = nextFile;
      audio.src = currFile.url;
      audio.play();
      onTrackChangeF?.(currFile.name);
    }
  };

  audio.onended = switchSong;

  return {
    htmlAudioElement: audio,
    async getVolume() {
      return audio.volume;
    },
    async setVolume(value: number) {
      audio.volume = value;
    },
    async getCurrentTime() {
      return audio.currentTime;
    },
    setCurrentTime(value: number) {
      audio.currentTime = value;
    },
    async getDuration() {
      return audio.duration;
    },
    async isEnded() {
      return audio.ended;
    },
    async isPaused() {
      return audio.paused;
    },
    get src() {
      return audio.src;
    },
    set src(value: string) {
      audio.src = value;
    },
    async isShuffling() {
      return shuffling;
    },
    setShuffling(val: boolean) {
      shuffling = val;
    },

    play() {
      if (!currFile) {
        switchSong();
      } else {
        audio.play();
      }
    },
    pause() {
      audio.pause();
    },

    getTrack() {
      return currFile;
    },
    setTracks(tracks: AudioFile[]) {
      audioFiles = tracks;
      onTracksChangeF?.();
    },
    getTracks() {
      return audioFiles;
    },
    playTrack(uuid: string) {
      let track = audioFiles.find(({ id }) => id == uuid);
      if (track) {
        currFile = track;
        audio.src = currFile.url;
        audio.play();
        onTrackChangeF?.(currFile.name);
      }
    },

    get onPause() {
      return onPauseF;
    },
    set onPause(f: VoidOrNull) {
      onPauseF = f;
      audio.onpause = () => f?.();
    },

    get onPlay() {
      return onPlayF;
    },
    set onPlay(f: VoidOrNull) {
      onPlayF = f;
      audio.onplay = () => f?.();
    },

    get onDurationChange() {
      return onDurationChangeF;
    },
    set onDurationChange(f: VoidOrNull) {
      onDurationChangeF = f;
      audio.ondurationchange = () => f?.();
    },

    get onTrackChange() {
      return onTrackChangeF;
    },
    set onTrackChange(f: ((name: string) => void) | null) {
      onTrackChangeF = f;
    },

    get onTracksChange() {
      return onTracksChangeF;
    },
    set onTracksChange(f: VoidOrNull) {
      onTracksChangeF = f;
    },
  };
};
