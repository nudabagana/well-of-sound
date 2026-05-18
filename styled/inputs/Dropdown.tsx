import styled from "styled-components";
import { FontSizes } from "../fontSizes";
import { Space } from "../space";

const Dropdown = styled.select`
  outline: none;
  border: solid 3px ${(p) => p.theme.clr.primary};
  font-size: ${FontSizes.sm};
  padding: ${Space.sm};
  margin-right: ${Space.sm};
  background-color: ${(p) => p.theme.clr.Bg};
  color: ${(p) => p.theme.clr.text};
  cursor: pointer;

  &:hover {
    border-color: ${(p) => p.theme.clr.primaryHover};
  }
`;

export default Dropdown;
