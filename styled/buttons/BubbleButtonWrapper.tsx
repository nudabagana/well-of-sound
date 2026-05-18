import styled from "styled-components";
import { Space } from "../space";

export const BubbleButtonWrapper = styled.div`
  display: flex;
  padding: ${Space.md};
  border: solid 3px ${(p) => p.theme.clr.primary};
  border-radius: 50%;
  & > * {
    fill: ${(p) => p.theme.clr.primary};
  }
`;
