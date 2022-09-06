import styled from "styled-components";

export const FileInputWrapper = styled.label`
  font-size: 18px;
  padding: 5px;
  margin-top: auto;
  margin-bottom: auto;
  background: ${(p) => p.theme.clr.primary};
  cursor: pointer;

  &:hover {
    background: ${(p) => p.theme.clr.primaryHover};
  }

  & > * {
    display: none;
  }
`;
