import styled from "styled-components";

type Props = { column?: boolean; flex1?: boolean };

const FlexDiv = styled.div<Props>`
  display: flex;
  flex-direction: ${(p) => (p.column ? "column" : "row")};
  ${(p) => p.flex1 && `flex:1`};
`;

export default FlexDiv;
