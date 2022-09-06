import styled from "styled-components";
import { untilDesktop } from "../utils";

export const MainContainer = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  padding: 10px;
  ${untilDesktop(`
    flex-direction: column;
  `)}
`;
