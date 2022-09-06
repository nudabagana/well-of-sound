import * as React from "react";
import { FC } from "react";
import { BubbleButtonWrapper } from "../styled/buttons/BubbleButtonWrapper";
import { Clrs } from "../styled/consts";

type IProps = {
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
};

const PlayPauseIcon: FC<IProps> = ({ active, onClick }) => {
  return (
    <BubbleButtonWrapper onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        {active ? (
          <>
            <path d="M6.5,0A3.5,3.5,0,0,0,3,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,6.5,0Z" />
            <path d="M17.5,0A3.5,3.5,0,0,0,14,3.5v17a3.5,3.5,0,0,0,7,0V3.5A3.5,3.5,0,0,0,17.5,0Z" />
          </>
        ) : (
          <path d="M20.492,7.969,10.954.975A5,5,0,0,0,3,5.005V19a4.994,4.994,0,0,0,7.954,4.03l9.538-6.994a5,5,0,0,0,0-8.062Z" />
        )}
      </svg>
    </BubbleButtonWrapper>
  );
};

export default PlayPauseIcon;
