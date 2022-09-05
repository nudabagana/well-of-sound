import { v4 as uuid } from "uuid";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Animations } from "../animations/AnimationList";
import { Clrs } from "../styles/consts";
import FlexDiv from "../styles/FlexDiv";
import { Animation } from "../types/AnimationTypes";
import { FileWithId } from "../types/FileTypes";
import { formatS } from "../utils/timeUtils";
import ShuffleIcon from "../icons/ShuffleIcon";

type Props = {
  player?: HTMLAudioElement | null;
  setAudioFiles: Dispatch<SetStateAction<FileWithId[]>>;
  setCurrFile: Dispatch<SetStateAction<FileWithId | undefined>>;
  currFile: FileWithId | undefined;
  setAnimation: Dispatch<SetStateAction<Animation | undefined>>;
  animation?: Animation;
  audioFiles: FileWithId[];
};

const Controls: FC<Props> = ({
  player,
  setAudioFiles,
  setCurrFile,
  currFile,
  setAnimation,
  animation,
  audioFiles,
}) => {
  const [duration, setDuration] = useState<number>();
  const [playTime, setPlayTime] = useState<number>(0);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(true);

  useEffect(() => {
    if (player) {
      player.volume = volume / 100;
    }
  }, [volume, player]);

  useEffect(() => {
    if (player) {
      player.onpause = (e) => !player.ended && setIsPlaying(false);
      player.onplay = () => setIsPlaying(true);
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      player.ondurationchange = () => setDuration(Math.floor(player.duration));
      player.ontimeupdate = () => setPlayTime(Math.floor(player.currentTime));
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      player.onended = () => {
        let nextFile =
          shuffle || !currFile
            ? audioFiles[Math.floor(Math.random() * audioFiles.length)]
            : audioFiles[audioFiles.indexOf(currFile) + 1];

        if (nextFile === currFile) {
          nextFile =
            audioFiles[audioFiles.indexOf(currFile) + 1] ??
            audioFiles[audioFiles.indexOf(currFile) - 1];
        }

        if (!nextFile) {
          setIsPlaying(false);
        } else {
          setCurrFile(nextFile);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, audioFiles, shuffle, currFile]);

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArr = [...files].map((file) => ({ file, id: uuid() }));
      setAudioFiles((existingFiles) =>
        existingFiles ? [...existingFiles, ...filesArr] : filesArr
      );
      if (!currFile) {
        setCurrFile(filesArr[Math.floor(Math.random() * filesArr.length)]);
      }
    }
  };

  const clearFiles = () => setAudioFiles([]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        alignItems: "start",
        gap: "10px",
        border: `solid 3px ${Clrs.primary}`,
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "start" }}>
        <input
          type="file"
          name="myImage"
          accept=".mp3,audio/*"
          multiple
          onChange={onFiles}
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            fontSize: "18px",
            width: "280px",
            color: "transparent",
          }}
          onClick={(event) => {
            if (event.target instanceof HTMLInputElement) {
              event.target.value = "";
            }
          }}
        />
        <button
          style={{
            fontSize: "18px",
            padding: "5px",
          }}
          onClick={clearFiles}
        >
          Clear files
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          style={{
            fontSize: "18px",
            padding: "5px",
          }}
          onClick={() => (isPlaying ? player?.pause() : player?.play())}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="range"
            min={0}
            max={duration}
            value={playTime}
            style={{ width: "200px", margin: "10px" }}
            onChange={(e) => {
              if (player) {
                player.currentTime = Number(e.target.value);
              }
            }}
          />
          <div>
            {formatS(playTime)}/{formatS(duration)}
          </div>
        </div>
      </div>
      <FlexDiv style={{ justifyContent: "space-between", width: "100%" }}>
        <div>
          <p style={{ margin: "0px 0px 5px 0" }}>Volume - {volume}%</p>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
        <div
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => setShuffle((s) => !s)}
        >
          <ShuffleIcon active={shuffle} />
        </div>
        <div>
          <p style={{ margin: "0px 0px 5px 0" }}>Visualizer</p>
          <select
            style={{ width: "150px", fontSize: "16px" }}
            value={animation?.id}
            onChange={(e) => {
              const newAnimation = Animations.find(
                ({ id }) => id === e.target.value
              );
              setAnimation(newAnimation);
            }}
          >
            {Animations.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </FlexDiv>
    </div>
  );
};

export default Controls;
