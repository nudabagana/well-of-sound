import { Dispatch, FC, SetStateAction } from "react";
import { Clrs } from "../styles/consts";

type Props = {
  audioFiles?: File[];
  currFile?: File;
  setCurrFile: Dispatch<SetStateAction<File | undefined>>;
};

const TrackList: FC<Props> = ({ audioFiles, currFile, setCurrFile }) => {
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
            onDoubleClick={() => setCurrFile(file)}
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
