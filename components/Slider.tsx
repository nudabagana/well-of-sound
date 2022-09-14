import { FC } from "react";

type Props = {
  name?: string;
  min: number;
  max: number;
  value: number;
  setValue(num: number): void;
};

const Slider: FC<Props> = ({ max, min, setValue, value, name }) => {
  return (
    <div>
      <p style={{ margin: "0px 0px 5px 0" }}>
        {name} - {value}/{max}
      </p>
      <input
        style={{ width: "400px" }}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
};

export default Slider;
