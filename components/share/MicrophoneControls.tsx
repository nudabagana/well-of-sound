import { FC } from "react";
import styled from "styled-components";
import Button from "../../styled/buttons/Button";
import { FontSizes } from "../../styled/fontSizes";
import Dropdown from "../../styled/inputs/Dropdown";
import FlexDiv from "../../styled/FlexDiv";
import { Space } from "../../styled/space";
import { untilDesktop } from "../../styled/utils";

type Props = {
  isLoading: boolean;
  microphoneDeviceId?: string;
  microphoneDevices: { id: string; label: string }[];
  onMicrophoneDeviceChange(deviceId: string): void;
  onCaptureMicrophone(): void;
};

const MicrophoneControlsContainer = styled(FlexDiv)`
  & > select {
    width: 180px;
  }

  ${untilDesktop(`
    width: 100%;
    flex-direction: column;
    align-items: stretch;

    & > select,
    & > button {
      width: 100%;
    }
  `)}
`;

const MicrophoneControls: FC<Props> = ({
  isLoading,
  microphoneDeviceId,
  microphoneDevices,
  onMicrophoneDeviceChange,
  onCaptureMicrophone,
}) => {
  return (
    <MicrophoneControlsContainer
      $wrap
      style={{ alignItems: "center", gap: Space.md }}
    >
      <Dropdown
        style={{ fontSize: FontSizes.sm }}
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
    </MicrophoneControlsContainer>
  );
};

export default MicrophoneControls;
