import { FC, useState, useEffect } from "react";
import { Clrs } from "../styled/consts";
import stringUtils from "../utils/stringUtils";

type Props = { songName?: string };

const InfoBar: FC<Props> = ({ songName }) => {
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
