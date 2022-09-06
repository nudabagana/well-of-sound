import styled from "styled-components";

const Button = styled.button`
  outline: none;
  border: none;
  font-family: inherit;
  padding: 0;

  background: ${(p) => p.theme.clr.primary};
  color: ${(p) => p.theme.clr.text};
  cursor: pointer;

  &:hover {
    background: ${(p) => p.theme.clr.primaryHover};
  }
`;

export default Button;
