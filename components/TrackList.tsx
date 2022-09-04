import { Dispatch, FC, SetStateAction } from "react";
import { Clrs } from "../styles/consts";
import { FileWithId } from "../types/FileTypes";

type Props = {
  audioFiles?: FileWithId[];
  currFile?: FileWithId;
  setCurrFile: Dispatch<SetStateAction<FileWithId | undefined>>;
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
      {audioFiles?.map((fileObj, i) => {
        const { file, id } = fileObj;
        return (
          <div
            key={id}
            onDoubleClick={() => setCurrFile(fileObj)}
            style={{
              backgroundColor: id === currFile?.id ? Clrs.primary : undefined,
            }}
          >
            {i} - {file.name}
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
