import { FC } from "react";
import { Animations } from "../../animations/AnimationList";
import Button from "../../styled/buttons/Button";
import { Borders } from "../../styled/borders";
import { FontSizes } from "../../styled/fontSizes";
import Dropdown from "../../styled/inputs/Dropdown";
import FlexDiv from "../../styled/FlexDiv";
import { Space } from "../../styled/space";
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
    <FlexDiv
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
        style={{ width: "140px", fontSize: FontSizes.sm }}
        value={animationId}
        onChange={(e) => onAnimationChange(e.target.value)}
      >
        {Animations.map(({ id, name }) => (
          <option value={id} key={id}>
            {name}
          </option>
        ))}
      </Dropdown>
      <FlexDiv style={{ alignItems: "center", gap: Space.md }}>
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
      </FlexDiv>
    </FlexDiv>
  );
};

export default ShareInfoBar;
