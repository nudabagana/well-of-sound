import { Dispatch, FC, SetStateAction } from "react";
import { Clrs } from "../styles/consts";
import { playProps, setNewSongProps } from "../utils/HomeUtils";

type Props = {
  audioFiles?: File[];
  setNewSong(props: setNewSongProps): Promise<void>;
  play(props: playProps): void;
  currFile?: File;
  player?: HTMLAudioElement;
  setCurrFile: Dispatch<SetStateAction<File | undefined>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setPlayer: Dispatch<SetStateAction<HTMLAudioElement | undefined>>;
  canvas: HTMLCanvasElement | null;
};

const TrackList: FC<Props> = ({
  audioFiles,
  setNewSong,
  play,
  currFile,
  player,
  setCurrFile,
  setIsPlaying,
  setPlayer,
  canvas,
}) => {
  return (
    <div
      style={{
        flex: "1 0 0px",
        width: "400px",
        overflow: "auto",
        border: `solid 3px ${Clrs.primary}`,
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
                  canvas,
                  songToPlay: file,
                })
              )
            }
            style={{
              backgroundColor:
                file.name === currFile?.name ? Clrs.primary : undefined,
            }}
          >
            {i} - {name}
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
