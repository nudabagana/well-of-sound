import { Dispatch, FC, SetStateAction } from "react";
import { Borders } from "../../styled/borders";
import { Clrs } from "../../styled/consts";
import { Space } from "../../styled/space";
import { AudioFile } from "../../types/FileTypes";
import stringUtils from "../../utils/stringUtils";

type Props = {
  audioFiles?: AudioFile[];
  currFile?: AudioFile;
  setCurrFile: Dispatch<SetStateAction<AudioFile | undefined>>;
};

const TrackList: FC<Props> = ({ audioFiles, currFile, setCurrFile }) => {
  return (
    <div
      style={{
        flex: "1 0 0px",
        overflow: "auto",
        minHeight: "200px",
        border: Borders.primary,
      }}
    >
      {audioFiles?.map((fileObj, i) => {
        const { name, id } = fileObj;
        return (
          <div
            key={id}
            onDoubleClick={() => setCurrFile(fileObj)}
            style={{
              backgroundColor: id === currFile?.id ? Clrs.primary : undefined,
              padding: `${Space.xs} ${Space.sm}`,
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
