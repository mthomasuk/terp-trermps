import { ReactElement } from "react";

import styled, { keyframes } from "styled-components";

interface Props {
  element: ReactElement;
  headline: string;
  info: ReactElement;
}

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const Fade = styled.section`
  background-color: rgba(255, 255, 255, 0.6);
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  animation: ${fadeOut} 1.5s forwards;
  animation-delay: 2s;
  pointer-events: none;
  z-index: 5;
`;

const H1 = styled.h1`
  margin: 0;
`;

const Element = styled.div`
  margin: 1.5rem 0;
`;

const Disappear = ({ element, info, headline }: Props): ReactElement => (
  <Fade>
    <H1>{headline}</H1>
    <div>{info}</div>
    <Element>{element}</Element>
  </Fade>
);

export default Disappear;
