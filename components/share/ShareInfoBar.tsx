import { FC } from "react";
import { Animations } from "../../animations/AnimationList";
import Button from "../../styled/buttons/Button";
import { Borders } from "../../styled/borders";
import { FontSizes } from "../../styled/fontSizes";
import Dropdown from "../../styled/inputs/Dropdown";
import FlexDiv from "../../styled/FlexDiv";
import { Space } from "../../styled/space";

type Props = {
  isSharing: boolean;
  isLoading: boolean;
  animationId?: string;
  onAnimationChange(animationId: string): void;
  onShare(): void;
};

const ShareInfoBar: FC<Props> = ({
  isSharing,
  isLoading,
  animationId,
  onAnimationChange,
  onShare,
}) => {
  return (
    <FlexDiv
      style={{
        border: Borders.primary,
        marginBottom: Space.md,
        padding: Space.md,
        fontSize: FontSizes.sm,
        alignItems: "center",
        justifyContent: "flex-end",
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
      <Button
        style={{
          fontSize: FontSizes.sm,
          padding: `${Space.sm} ${Space.md}`,
        }}
        onClick={onShare}
      >
        {isLoading ? "Connecting..." : isSharing ? "Share again" : "Share audio"}
      </Button>
    </FlexDiv>
  );
};

export default ShareInfoBar;
