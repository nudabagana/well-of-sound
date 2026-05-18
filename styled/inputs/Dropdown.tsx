import styled from "styled-components";

const Dropdown = styled.select`
  outline: none;
  border: solid 3px ${(p) => p.theme.clr.primary};
  font-size: 16px;
  padding: 5px 8px 5px 8px;
  margin-right: 5px;
  background-color: ${(p) => p.theme.clr.Bg};
  color: ${(p) => p.theme.clr.text};
  cursor: pointer;

  &:hover {
    border-color: ${(p) => p.theme.clr.primaryHover};
  }
`;

export default Dropdown;
