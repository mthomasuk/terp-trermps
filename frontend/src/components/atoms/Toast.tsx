import { ReactElement } from "react";

import styled, { keyframes } from "styled-components";

interface Props {
  element: ReactElement;
  name: string;
}

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const Disappear = styled.section`
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

const Toast = ({ element, name }: Props): ReactElement => (
  <Disappear>
    <H1>WINNING CARD</H1>
    <p>
      Played by: <strong>{name}</strong>
    </p>
    <div>{element}</div>
  </Disappear>
);

export default Toast;
