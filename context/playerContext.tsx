import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { AudioTrack, Player } from "../types/PlayerTypes";

type PlayerContextType = {
  currTrack: AudioTrack | null;
  tracks: AudioTrack[];
  player: Player | null;
  isPaused: boolean;
  setPlayer: (player: Player | null) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [currTrack, setCurrTrack] = useState<AudioTrack | null>(null);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (player) {
      player.getTrack().then((track) => setCurrTrack(track));
      setTracks(player.getTracks());
      player.isPaused().then((isPaused) => setIsPaused(isPaused));
      player.onTrackChange = (track) => setCurrTrack(track);
      player.onTracksChange = () => setTracks(player.getTracks());
      player.onPauseChange = (isPaused) => setIsPaused(isPaused);
    }
  }, [player]);

  return (
    <PlayerContext.Provider
      value={{ player, currTrack, tracks, isPaused, setPlayer }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("useTrackContext must be used within a TrackProvider");
  }
  return context;
};
