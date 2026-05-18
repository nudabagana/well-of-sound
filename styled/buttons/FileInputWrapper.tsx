import styled from "styled-components";
import { FontSizes } from "../fontSizes";
import { Space } from "../space";

export const FileInputWrapper = styled.label`
  font-size: ${FontSizes.md};
  padding: ${Space.sm};
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
