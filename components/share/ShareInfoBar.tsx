import { FC } from "react";
import { Animations } from "../../animations/AnimationList";
import Button from "../../styled/buttons/Button";
import { Clrs } from "../../styled/consts";
import Dropdown from "../../styled/inputs/Dropdown";
import FlexDiv from "../../styled/FlexDiv";

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
        border: `solid 3px ${Clrs.primary}`,
        marginBottom: "10px",
        padding: "10px",
        fontSize: "16px",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "10px",
      }}
    >
      <Dropdown
        style={{ width: "140px", fontSize: "16px" }}
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
          fontSize: "16px",
          padding: "6px 10px",
        }}
        onClick={onShare}
      >
        {isLoading ? "Connecting..." : isSharing ? "Share again" : "Share audio"}
      </Button>
    </FlexDiv>
  );
};

export default ShareInfoBar;
