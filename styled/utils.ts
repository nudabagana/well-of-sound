import { screenMaxWidths } from "./sizes";

/*Responsiveness*/
export const untilDesktop = (cssRules: string) => `
  @media (max-width: ${screenMaxWidths.tablet}px) {
    ${cssRules}
  }
`;

export const afterTablet = (cssRules: string) => `
  @media (min-width: ${screenMaxWidths.tablet + 1}px) {
    ${cssRules}
  }
`;
