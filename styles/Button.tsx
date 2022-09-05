import {
  FC,
  useState,
  useEffect,
  PropsWithChildren,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from "react";
import { Clrs } from "./consts";

type Props = {} & PropsWithChildren &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Button: FC<Props> = ({ children, style, ...props }) => {
  const [bg, setBg] = useState(Clrs.primary);
  return (
    <button
      onMouseOver={() => setBg(Clrs.primaryHover)}
      onMouseOut={() => setBg(Clrs.primary)}
      style={{
        background: bg,
        color: Clrs.text,
        border: "none",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
