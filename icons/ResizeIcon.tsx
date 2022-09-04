import * as React from "react";
import { FC } from "react";

type IProps = {
  active?: boolean;
  style?: React.CSSProperties;
  onClick: React.MouseEventHandler<SVGSVGElement> | undefined;
};

const ResizeIcon: FC<IProps> = ({ active, style, onClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="48"
      height="48"
      style={{ fill: "#262626", ...style }}
      onClick={onClick}
    >
      {active ? (
        <g id="_01_align_center" data-name="01 align center">
          <path d="M1.414,0,0,1.414,4.293,5.707,2,8H7A1,1,0,0,0,8,7V2L5.707,4.293Z" />
          <path d="M22,16H17a1,1,0,0,0-1,1v5l2.293-2.293L22.586,24,24,22.586l-4.293-4.293Z" />
          <path d="M17,8h5L19.707,5.707,24,1.414,22.586,0,18.293,4.293,16,2V7A1,1,0,0,0,17,8Z" />
          <path d="M7,16H2l2.293,2.293L0,22.586,1.414,24l4.293-4.293L8,22V17A1,1,0,0,0,7,16Z" />
        </g>
      ) : (
        <path d="M20.7,4.724l1.595,1.594A1,1,0,0,0,24,5.613l0-4.6a1,1,0,0,0-1-1H18.393a1,1,0,0,0-.707,1.705l1.6,1.595L12,10.587,4.709,3.3,6.314,1.7A1,1,0,0,0,5.607-.008L1-.01a1,1,0,0,0-1,1v4.6A1,1,0,0,0,1.709,6.3L3.3,4.714,10.587,12,3.305,19.276l-1.6-1.595A1,1,0,0,0,0,18.387l0,4.6a1,1,0,0,0,1,1H5.607a1,1,0,0,0,.707-1.7L4.719,20.689,12,13.413l7.282,7.275-1.6,1.6a1,1,0,0,0,.707,1.7l4.605,0a1,1,0,0,0,1-1v-4.6a1,1,0,0,0-1.707-.707L20.7,19.275,13.414,12Z" />
      )}
    </svg>
  );
};

export default ResizeIcon;
