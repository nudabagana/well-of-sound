import { AudioTrack, Player, VoidOrNull } from "../types/PlayerTypes";
import { randomInt } from "../utils/mathUtls";
import { v4 as uuid } from "uuid";

const INITIAL_FILE: AudioTrack = {
  id: uuid(),
  name: "Hug a Turtle",
  url: "/Parry_Gripp_Hug_A_Turtle.mp3",
};

type MakeHTMLAudioProps = { shuffle?: boolean };
export const makeHTMLAudioElementPlayer = (
  defaults?: MakeHTMLAudioProps
): Player => {
  let audio = new Audio();

  let shuffle = defaults?.shuffle !== undefined ? defaults.shuffle : true;
  let audioTracks: AudioTrack[] = [INITIAL_FILE];
  let currTrack: AudioTrack | null = null;

  let onDurationChangeF: VoidOrNull = null;
  let onPauseChangeF: ((isPaused: boolean) => void) | null = null;
  let onTrackChangeF: ((track: AudioTrack | null) => void) | null = null;
  let onTracksChangeF: VoidOrNull = null;

  audio.onended = () => {
    currTrack = selectNextTrack(shuffle, audioTracks, currTrack);
    onTrackChangeF?.(currTrack);
    if (currTrack) {
      audio.src = currTrack.url;
      audio.play();
    }
  };
  audio.onplay = () => onPauseChangeF?.(audio.paused);

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
    async isPaused() {
      return audio.paused;
    },
    async isShuffling() {
      return shuffle;
    },
    setShuffling(val: boolean) {
      shuffle = val;
    },

    play() {
      if (!currTrack) {
        currTrack = selectNextTrack(shuffle, audioTracks, currTrack);
        onTrackChangeF?.(currTrack);
        if (currTrack) {
          audio.src = currTrack.url;
          audio.play();
        }
      } else {
        audio.play();
      }
    },
    pause() {
      audio.pause();
    },

    async getTrack() {
      return currTrack;
    },
    setTracks(tracks: AudioTrack[]) {
      audioTracks = tracks;
      onTracksChangeF?.();
    },
    getTracks() {
      return audioTracks;
    },
    setTrack(uuid: string) {
      let track = audioTracks.find(({ id }) => id == uuid);
      if (track) {
        currTrack = track;
        onTrackChangeF?.(currTrack);
        audio.src = currTrack.url;
        return true;
      }
      return false;
    },

    get onPauseChange() {
      return onPauseChangeF;
    },
    set onPauseChange(f: ((isPaused: boolean) => void) | null) {
      onPauseChangeF = f;
      audio.onpause = () => f?.(audio.paused);
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
    set onTrackChange(f: ((track: AudioTrack | null) => void) | null) {
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

let selectNextTrack = (
  shuffle: boolean,
  audioTracks: AudioTrack[],
  currTrack: AudioTrack | null
) => {
  let nextTrack: AudioTrack | null =
    shuffle || !currTrack
      ? audioTracks[randomInt(audioTracks.length)]
      : audioTracks[audioTracks.indexOf(currTrack) + 1];

  if (nextTrack === currTrack) {
    nextTrack =
      audioTracks[audioTracks.indexOf(currTrack) + 1] ??
      audioTracks[audioTracks.indexOf(currTrack) - 1];
  }
  if (nextTrack) {
    return nextTrack;
  }
  return null;
};
