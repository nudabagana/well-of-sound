import { AudioTrack, Player, VoidOrNull } from "../types/PlayerTypes";
import {
  CBError,
  WebPlaybackState,
  WebPlaybackTrack,
} from "../typings/spotify";
import { MS_IN_S } from "../utils/timeUtils";
import { v4 as uuid } from "uuid";

const SPOTIFY_TOKEN =
  "BQB9zV1i2gsAhdCkydqfs52Bwkq2e9qnCnioOeBpkMA0hrhuwGSxhQYIB5PXRrruayvtVQXmNSOJiHaIHqeWonwL2j3PCPJV0FNuLI2HMZHexBezwoSeKGqBm9YeO1MRJ8LbDlAgUd_EAWPoSgju-LBBUdzahAfKiUxaFqzO14DkeYvHXzgWoujj5ArIKpn0bawczG_zVMX9eZ7yiA";

export const makeSpotifyPlayer = (cb: (player: Player) => void) => {
  let player = new Spotify.Player({
    name: "Well of Sound",
    getOAuthToken: (cb) => {
      cb(SPOTIFY_TOKEN);
    },
    volume: 0.5,
    enableMediaSession: false,
  });

  let duration = 0;
  let trackName: string = "";
  let isPaused = true;
  let onDurationChangeF: VoidOrNull = null;
  let onPauseChangeF: ((isPaused: boolean) => void) | null = null;
  let onTrackChangeF: ((track: AudioTrack | null) => void) | null = null;
  let onTracksChangeF: VoidOrNull = null;

  player.addListener("player_state_changed", (state: WebPlaybackState) => {
    if (duration !== state.duration) {
      duration = state.duration;
      onDurationChangeF?.();
    }
    if (isPaused !== state.paused) {
      isPaused = state.paused;
      onPauseChangeF?.(isPaused);
    }
    const newTrackName = makeTrackName(state.track_window.current_track);
    if (trackName !== newTrackName) {
      trackName = newTrackName;
      onTrackChangeF?.({
        name: trackName,
        id: state.track_window.current_track?.id ?? "",
        url: "",
      });
    }
  });
  setupErrLogging(player);

  const playerToReturn: Player = {
    async getDuration() {
      const state = await player.getCurrentState();
      return Math.floor((state?.duration ?? 0) / MS_IN_S);
    },
    async getCurrentTime() {
      const state = await player.getCurrentState();
      return (state?.position ?? 0) / MS_IN_S;
    },
    async setCurrentTime(value: number) {
      await player.seek(value * MS_IN_S);
    },

    async getVolume() {
      return player.getVolume();
    },
    async setVolume(value: number) {
      player.setVolume(value);
    },

    async isShuffling() {
      const state = await player.getCurrentState();
      return state?.shuffle ?? true;
    },
    setShuffling(val: boolean) {
      // TODO: Add shuffle API Call
    },

    async isPaused() {
      const state = await player.getCurrentState();
      return state?.paused || true;
    },

    async getTrack() {
      const state = await player.getCurrentState();
      return {
        name: makeTrackName(state?.track_window.current_track),
        id: state?.track_window.current_track?.id ?? "",
        url: "",
      };
    },
    setTrack(uuid: string) {
      // TODO: Add setTrack API Call
      return true;
    },
    getTracks() {
      return [];
    },
    setTracks(tracks: AudioTrack[]) {},

    play() {
      player.resume();
    },
    pause() {
      player.pause();
    },

    get onDurationChange() {
      return onDurationChangeF;
    },
    set onDurationChange(f: VoidOrNull) {
      onDurationChangeF = f;
    },

    get onPauseChange() {
      return onPauseChangeF;
    },
    set onPauseChange(f: ((isPaused: boolean) => void) | null) {
      onPauseChangeF = f;
    },

    get onTracksChange() {
      return onTracksChangeF;
    },
    set onTracksChange(f: VoidOrNull) {
      onTracksChangeF = f;
    },
    get onTrackChange() {
      return onTrackChangeF;
    },
    set onTrackChange(f: ((track: AudioTrack | null) => void) | null) {
      onTrackChangeF = f;
    },
  };

  player.addListener("ready", () => {
    cb(playerToReturn);
  });
  player.connect();
};

const makeTrackName = (track?: WebPlaybackTrack | null) => {
  if (!track) {
    return "";
  }

  return `${track.artists.map(({ name }) => name).join(", ")} - ${track.name}`;
};

const setupErrLogging = (player: Spotify.Player) => {
  player.addListener("not_ready", () => {
    console.log("Spotify - Not ready");
  });

  player.addListener("initialization_error", ({ message }: CBError) => {
    console.error(message);
  });

  player.addListener("authentication_error", ({ message }: CBError) => {
    console.error(message);
  });

  player.addListener("account_error", ({ message }: CBError) => {
    console.error(message);
  });
};
