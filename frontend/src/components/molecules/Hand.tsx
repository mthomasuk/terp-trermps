import { useState, useEffect, useContext, ReactElement } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

import { BattleControlContext } from "../context/BattleControlStore";
import { useSocket } from "../context/Websocket";

import Card from "./Card";

interface Props {
  cards: any[];
  leader: boolean;
  roundId: string;
  selectedCard?: any;
  selectedAttr?: string;
  droppedCard?: any;
  onPlayHand: (hand: any) => void;
  onSelectCard: (hand: any) => void;
  onSetDroppedCard: (hand: any) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const Play = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #333;
  border-radius: 4px;
  margin: 0 1rem;
  height: 324px;
  width: 210px;
  display: flex;
  position: relative;
`;

const InPlay = styled(Play)`
  &:after {
    position: absolute;
    color: #acacac;
    content: "Click to move card into hand";
    font-size: 1.15rem;
    text-transform: uppercase;
  }
`;

const ToPlay = styled(Play)<{ isDraggedOver?: boolean; error?: string }>`
  transition: transform 0.25s ease-in-out;

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
        content: "Drop to play card"
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

const Hand = ({
  cards,
  leader = false,
  selectedCard,
  selectedAttr: SA,
  droppedCard,
  roundId,
  onPlayHand,
  onSelectCard,
  onSetDroppedCard,
}: Props): ReactElement => {
  const { id }: any = useParams();

  const { attributeSelected } = useSocket(id);
  const { setAttribute } = useContext(BattleControlContext);

  const [selectedAttr, selectAttr] = useState<string | undefined>();
  const [dropErr, setDropErr] = useState<string | undefined>();

  const [cardInPlay, playCard] = useState<any | undefined>();

  const [isDraggedOver, setDragOver] = useState<boolean>(false);

  const onSelectAttribute = async (attr: string) => {
    if (!leader) {
      return false;
    }

    if (attr !== selectedAttr) {
      await setAttribute(roundId, attr);
      selectAttr((prev) => (attr === prev ? undefined : attr));
    }
  };

  const onDragOver = (event: any) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (event: any) => {
    event.preventDefault();
    setDragOver(false);
  };

  const onDrop = (event: any) => {
    setDragOver(false);

    if (!selectedAttr && leader) {
      setDropErr("Select a category first e.g. strength/skill etc.");
      return false;
    }

    event.stopPropagation();

    onSelectCard(undefined);
    onSetDroppedCard(cardInPlay);

    onPlayHand(cardInPlay);
  };

  useEffect(() => {
    playCard(undefined);

    selectAttr(undefined);
    setDropErr(undefined);

    setDragOver(false);
  }, [cards]);

  useEffect(() => {
    if (SA) {
      selectAttr(SA);
    }
    if (attributeSelected) {
      selectAttr(attributeSelected);
    }
  }, [SA, attributeSelected]);

  return (
    <Container>
      <InPlay>
        {selectedCard && (
          <Card
            selected
            next
            card={selectedCard}
            selectedAttr={selectedAttr}
            onSelectAttribute={onSelectAttribute}
            onDrag={playCard}
          />
        )}
      </InPlay>
      <ToPlay
        isDraggedOver={isDraggedOver}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        error={dropErr}
      >
        {droppedCard && (
          <Card played next card={droppedCard} selectedAttr={selectedAttr} />
        )}
      </ToPlay>
    </Container>
  );
};

export default Hand;
