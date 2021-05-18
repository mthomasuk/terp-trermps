import { ReactElement } from "react";

import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from {
      transform:rotate(0deg);
  }
  to {
      transform:rotate(360deg);
  }
`;

const Loading = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #ffff9d;
  display: flex;
  align-items: center;
  justify-content: center;
  animation-name: ${spin};
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

const Loader = (): ReactElement => <Loading>Loading...</Loading>;

export default Loader;
