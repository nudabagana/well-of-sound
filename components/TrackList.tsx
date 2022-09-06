import { Dispatch, FC, SetStateAction } from "react";
import { Clrs } from "../styled/consts";
import { FileWithId } from "../types/FileTypes";
import stringUtils from "../utils/stringUtils";

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
        overflow: "auto",
        minHeight: "200px",
        border: `solid 3px ${Clrs.primary}`,
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
              padding: "2px 5px 2px 5px",
            }}
          >
            {i} - {stringUtils.trimExtension(file.name)}
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;
