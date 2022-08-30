import { CSSProperties, FC, PropsWithChildren } from "react";

type Props = { style?: CSSProperties; column?: boolean } & PropsWithChildren;

const FlexDiv: FC<Props> = ({ style, children, column }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: column ? "column" : "row",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default FlexDiv;
