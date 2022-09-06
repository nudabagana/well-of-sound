import 'styled-components';

interface Colors {
  primary: string;
  primaryHover: string;
  Bg: string;
  text: string;
}

export interface StyledTheme {
  clr: Colors;
  // font: '*.ttf';
}

declare module 'styled-components' {
  export interface DefaultTheme extends StyledTheme {}
}
