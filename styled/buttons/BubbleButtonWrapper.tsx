import styled from "styled-components";

export const BubbleButtonWrapper = styled.div`
  display: flex;
  padding: 10px;
  border: solid 3px ${(p) => p.theme.clr.primary};
  border-radius: 50%;
  & > * {
    fill: ${(p) => p.theme.clr.primary};
  }
`;
