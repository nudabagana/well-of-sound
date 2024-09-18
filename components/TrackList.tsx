import { FC, useEffect, useState } from "react";
import { Clrs } from "../styled/consts";
import { Player } from "../types/PlayerTypes";
import stringUtils from "../utils/stringUtils";

type Props = {
  player?: Player | null | undefined;
};

const TrackList: FC<Props> = ({ player }) => {
  const [currFile, setCurrFile] = useState(player?.getTrack());
  const [audioFiles, setAudioFiles] = useState(player?.getTracks());

  useEffect(() => {
    if (player) {
      setCurrFile(player.getTrack());
      setAudioFiles(player.getTracks());
      player.onTrackChange = () => setCurrFile(player.getTrack());
      player.onTracksChange = () => setAudioFiles(player.getTracks());
    }
  }, [player]);

  return (
    <div
      style={{
        flex: "1 0 0px",
        overflow: "auto",
        minHeight: "200px",
        border: `solid 3px ${Clrs.primary}`,
      }}
    >
      {audioFiles?.map((fileObj, i) => {
        const { name, id } = fileObj;
        return (
          <div
            key={id}
            onDoubleClick={() => player?.playTrack(id)}
            style={{
              backgroundColor: id === currFile?.id ? Clrs.primary : undefined,
              padding: "2px 5px 2px 5px",
              cursor: "pointer",
            }}
          >
            {i} - {stringUtils.trimExtension(name)}
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
