import { ReactElement } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

import { useSocket } from "../context/Websocket";

interface Props {
  isLeader: boolean;
  battleInProgress: boolean;
  selectedAttr?: string;
}

const Status = styled.h3`
  display: block;
  font-weight: normal;

  @media only screen and (max-width: 768px) {
    & {
      font-size: 1.15rem;
    }
  }
`;

const massageAttribute = (attr?: string): string =>
  attr ? attr.replace("_", " ") : "";

const BattleStatus = ({
  battleInProgress,
  isLeader,
  selectedAttr,
}: Props): ReactElement => {
  const { id }: any = useParams();

  const { attributeSelected } = useSocket(id);

  let status = "Waiting for the battle to start";

  if (battleInProgress) {
    status = "Your enemy is plotting something...";
  }

  if (isLeader) {
    status = "Choose your card & attribute!";
  }

  if (attributeSelected || selectedAttr) {
    status = `Attribute is ${massageAttribute(
      attributeSelected || selectedAttr
    )}!`;
  }

  return <Status>{status}</Status>;
};

export default BattleStatus;
