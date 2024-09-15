import { Player, VoidOrNull } from "../types/PlayerTypes";

export const makeHTMLAudioElementPlayer = (): Player => {
  let audio = new Audio();

  let onEndedF: VoidOrNull = null;
  let onDurationChangeF: VoidOrNull = null;
  let onPlayF: VoidOrNull = null;
  let onPauseF: VoidOrNull = null;
  let onTrackChangeF: ((name: string) => void) | null = null;

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

    play() {
      audio.play();
    },
    pause() {
      audio.pause();
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

    get onEnded() {
      return onEndedF;
    },
    set onEnded(f: VoidOrNull) {
      onEndedF = f;
      audio.onended = () => f?.();
    },

    get onTrackChange() {
      return onTrackChangeF;
    },
    set onTrackChange(f: ((name: string) => void) | null) {
      onTrackChangeF = f;
    },
  };
};
