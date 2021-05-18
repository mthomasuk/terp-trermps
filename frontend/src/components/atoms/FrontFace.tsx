import { ReactElement, ReactNode } from "react";

import styled from "styled-components";

interface Props {
  children: ReactNode;
}

const Face = styled.div`
  border-radius: 7px;
  background-color: #fff;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Front = styled(Face)``;

const FrontFace = ({ children }: Props): ReactElement => (
  <Front>{children}</Front>
);

export default FrontFace;
