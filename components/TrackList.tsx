import { FC } from "react";
import { usePlayerContext } from "../context/playerContext";
import { Clrs } from "../styled/consts";
import stringUtils from "../utils/stringUtils";

const TrackList: FC = () => {
  const { tracks, currTrack, player } = usePlayerContext();

  return (
    <div
      style={{
        flex: "1 0 0px",
        overflow: "auto",
        minHeight: "200px",
        border: `solid 3px ${Clrs.primary}`,
      }}
    >
      {tracks?.map((fileObj, i) => {
        const { name, id } = fileObj;
        return (
          <div
            key={id}
            onDoubleClick={() => player?.setTrack(id) && player?.play()}
            style={{
              backgroundColor: id === currTrack?.id ? Clrs.primary : undefined,
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
