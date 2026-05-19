import { FC } from "react";
import styled from "styled-components";
import { Animations } from "../../animations/AnimationList";
import Button from "../../styled/buttons/Button";
import { Borders } from "../../styled/borders";
import { FontSizes } from "../../styled/fontSizes";
import Dropdown from "../../styled/inputs/Dropdown";
import FlexDiv from "../../styled/FlexDiv";
import { Space } from "../../styled/space";
import { untilDesktop } from "../../styled/utils";
import MicrophoneControls from "./MicrophoneControls";

type Props = {
  isLoading: boolean;
  animationId?: string;
  microphoneDeviceId?: string;
  microphoneDevices: { id: string; label: string }[];
  onAnimationChange(animationId: string): void;
  onMicrophoneDeviceChange(deviceId: string): void;
  onShareAudio(): void;
  onCaptureMicrophone(): void;
};

const ShareInfoBarContainer = styled(FlexDiv)`
  & > select {
    width: 180px;
  }

  ${untilDesktop(`
    flex-direction: column;
    align-items: stretch;

    & > select {
      width: 100%;
    }
  `)}
`;

const ShareInfoBarControls = styled(FlexDiv)`
  ${untilDesktop(`
    flex-direction: column;
    align-items: stretch;
    width: 100%;

    & > button {
      width: 100%;
    }
  `)}
`;

const ShareInfoBar: FC<Props> = ({
  isLoading,
  animationId,
  microphoneDeviceId,
  microphoneDevices,
  onAnimationChange,
  onMicrophoneDeviceChange,
  onShareAudio,
  onCaptureMicrophone,
}) => {
  return (
    <ShareInfoBarContainer
      $wrap
      style={{
        border: Borders.primary,
        marginBottom: Space.md,
        padding: Space.md,
        fontSize: FontSizes.sm,
        alignItems: "center",
        justifyContent: "space-between",
        gap: Space.md,
      }}
    >
      <Dropdown
        style={{ fontSize: FontSizes.sm }}
        value={animationId}
        onChange={(e) => onAnimationChange(e.target.value)}
      >
        {Animations.map(({ id, name }) => (
          <option value={id} key={id}>
            {name}
          </option>
        ))}
      </Dropdown>
      <ShareInfoBarControls
        $wrap
        style={{
          alignItems: "center",
          gap: Space.md,
          justifyContent: "flex-end",
        }}
      >
        <MicrophoneControls
          isLoading={isLoading}
          microphoneDeviceId={microphoneDeviceId}
          microphoneDevices={microphoneDevices}
          onMicrophoneDeviceChange={onMicrophoneDeviceChange}
          onCaptureMicrophone={onCaptureMicrophone}
        />
        <Button
          style={{
            fontSize: FontSizes.sm,
            padding: `${Space.sm} ${Space.md}`,
          }}
          onClick={onShareAudio}
        >
          {isLoading ? "Connecting..." : "Share audio"}
        </Button>
      </ShareInfoBarControls>
    </ShareInfoBarContainer>
  );
};

export default ShareInfoBar;
