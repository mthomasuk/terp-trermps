import { ReactElement } from "react";

import styled from "styled-components";

import { useSocket } from "../context/Websocket";

interface Props {
  id: string;
  isLeader: boolean;
  selectedAttr?: string;
}

const Status = styled.h1`
  display: block;
  font-weight: normal;

  @media only screen and (max-width: 768px) {
    & {
      font-size: 1.15rem;
    }
  }
`;

const BattleStatus = ({ id, isLeader, selectedAttr }: Props): ReactElement => {
  const { attributeSelected } = useSocket(id);

  let status = "Waiting for other player to choose card";

  if (isLeader) {
    status = "Choose your attribute to play!";
  }

  if (attributeSelected || selectedAttr) {
    status = `Attribute is ${attributeSelected || selectedAttr}!`;
  }

  return <Status>{status}</Status>;
};

export default BattleStatus;
