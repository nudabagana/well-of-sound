import styled from "styled-components";
import { Space } from "../space";
import { untilDesktop } from "../utils";

export const MainContainer = styled.div`
  display: flex;
  gap: ${Space.md};
  flex: 1;
  padding: ${Space.md};
  ${untilDesktop(`
    flex-direction: column;
  `)}
`;
