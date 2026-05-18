import { FC } from "react";
import Button from "../../styled/buttons/Button";
import { FontSizes } from "../../styled/fontSizes";
import Dropdown from "../../styled/inputs/Dropdown";
import FlexDiv from "../../styled/FlexDiv";
import { Space } from "../../styled/space";

type Props = {
  isLoading: boolean;
  microphoneDeviceId?: string;
  microphoneDevices: { id: string; label: string }[];
  onMicrophoneDeviceChange(deviceId: string): void;
  onCaptureMicrophone(): void;
};

const MicrophoneControls: FC<Props> = ({
  isLoading,
  microphoneDeviceId,
  microphoneDevices,
  onMicrophoneDeviceChange,
  onCaptureMicrophone,
}) => {
  return (
    <FlexDiv style={{ alignItems: "center", gap: Space.md }}>
      <Dropdown
        style={{ width: "180px", fontSize: FontSizes.sm }}
        value={microphoneDeviceId}
        onChange={(e) => onMicrophoneDeviceChange(e.target.value)}
      >
        {microphoneDevices.map(({ id, label }) => (
          <option value={id} key={id}>
            {label}
          </option>
        ))}
      </Dropdown>
      <Button
        style={{
          fontSize: FontSizes.sm,
          padding: `${Space.sm} ${Space.md}`,
        }}
        onClick={onCaptureMicrophone}
      >
        {isLoading ? "Connecting..." : "Capture mic"}
      </Button>
    </FlexDiv>
  );
};

export default MicrophoneControls;
