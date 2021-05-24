import styled from "styled-components";

import { Play } from "./InPlay";

const ToPlay = styled(Play)<{
  isDraggedOver?: boolean;
  error?: string;
  leader?: boolean;
}>`
  transition: transform 0.25s ease-in-out;

  &:before {
    position: absolute;
    ${({ leader }) => {
      if (leader) {
        return `
          content: "🗡️";
        `;
      }
      return `
        content: "🛡️";
      `;
    }};
    font-size: 1.15rem;
    top: -2rem;
  }

  &:after {
    position: absolute;
    color: #acacac;
    ${({ error }) => {
      if (error) {
        return `
          color: #e3c20f;
          font-size: 1.05rem;
          content: "${error}";
        `;
      }
      return `
        font-size: 1.15rem;
        content: "Drop to play card";

        @media only screen and (max-width: 768px) {
          & {
            content: "Press to play card";
          }
        }
      `;
    }};
    text-transform: uppercase;
  }

  ${({ isDraggedOver }) =>
    isDraggedOver
      ? `
  transform: scale(1.05);
  `
      : ""}
`;

export default ToPlay;
