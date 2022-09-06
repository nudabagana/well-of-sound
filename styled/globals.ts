import { createGlobalStyle } from "styled-components";

/* @font-face {
  font-family: 'Main';
  src: url(${(p) => p.theme.font});
} */

export const GlobalStyle = createGlobalStyle`
  html,
  body,
  #app,
  #__next {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
   color: ${(p) => p.theme.clr.text};
   margin: 0;
   font-size: 18px;
  }
`;
