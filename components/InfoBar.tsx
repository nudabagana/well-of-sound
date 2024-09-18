import { FC } from "react";
import { usePlayerContext } from "../context/playerContext";
import { Clrs } from "../styled/consts";
import stringUtils from "../utils/stringUtils";

const InfoBar: FC = () => {
  const { currTrack } = usePlayerContext();
  const songName = currTrack?.name;
  return (
    <div
      style={{
        border: `solid 3px ${Clrs.primary}`,
        marginBottom: "10px",
        padding: "10px",
        textAlign: "center",
        fontSize: "16px",
      }}
    >
      {!songName ? (
        <b>Paused</b>
      ) : (
        <>
          Now playing: <b>{stringUtils.trimExtension(songName)}</b>
        </>
      )}
    </div>
  );
};

export default InfoBar;
