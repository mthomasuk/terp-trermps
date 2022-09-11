import { useParams } from "react-router-dom";

import styled from "styled-components";

import { useSocket } from "../context/Websocket";

interface Props {
  isLeader: boolean;
  battleInProgress: boolean;
  selectedAttr?: string;
  noOfCards: number;
  totalCards: number;
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

export const testIds = {
  ROOT: "battle-status-Status",
};

const BattleStatus = ({
  battleInProgress,
  isLeader,
  selectedAttr,
  noOfCards,
  totalCards,
}: Props) => {
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

  return (
    <div>
      {battleInProgress && (
        <>
          <strong># of cards in your hand:</strong> {noOfCards}/{totalCards}
        </>
      )}
      <Status data-testid={testIds.ROOT}>{status}</Status>
    </div>
  );
};

export default BattleStatus;
