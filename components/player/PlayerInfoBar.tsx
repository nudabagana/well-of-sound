import { FC } from "react";
import { Borders } from "../../styled/borders";
import { FontSizes } from "../../styled/fontSizes";
import { Space } from "../../styled/space";
import stringUtils from "../../utils/stringUtils";

type Props = { songName?: string };

const PlayerInfoBar: FC<Props> = ({ songName }) => {
  return (
    <div
      style={{
        border: Borders.primary,
        marginBottom: Space.md,
        padding: Space.md,
        textAlign: "center",
        fontSize: FontSizes.sm,
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

export default PlayerInfoBar;
