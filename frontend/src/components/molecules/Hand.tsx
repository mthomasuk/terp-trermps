import { useState, useEffect, useContext, DragEvent, TouchEvent } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

import { BattleControlContext } from "../context/BattleControlStore";
import { useSocket } from "../context/Websocket";

import InPlay from "../atoms/InPlay";
import ToPlay from "../atoms/ToPlay";

import Card from "./Card";

interface Props {
  cards: CardInterface[];
  leader: boolean;
  roundId: string;
  selectedCard?: CardInterface;
  selectedAttr?: string;
  droppedCard?: any;
  onPlayHand: (card: CardInterface | undefined) => void;
  onSelectCard: (card: CardInterface | undefined) => void;
  onSetDroppedCard: (card: CardInterface | undefined) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;

  @media only screen and (max-width: 768px) {
    & {
      flex-direction: column;
    }
  }
`;

const Hand = ({
  cards,
  leader = false,
  selectedCard,
  selectedAttr,
  droppedCard,
  roundId,
  onPlayHand,
  onSelectCard,
  onSetDroppedCard,
}: Props) => {
  const { id }: any = useParams();

  const { attributeSelected } = useSocket(id);
  const { setAttribute } = useContext(BattleControlContext);

  const selectedAttribute = attributeSelected || selectedAttr;

  const [dropErr, setDropErr] = useState<string | undefined>();
  const [cardInPlay, playCard] = useState<CardInterface | undefined>();
  const [isDraggedOver, setDragOver] = useState<boolean>(false);

  const onSelectAttribute = async (attr: string) => {
    if (!leader) {
      return false;
    }

    if (attr !== selectedAttribute) {
      await setAttribute(roundId, attr);
    }
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (event: DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const onDrop = (event: DragEvent | TouchEvent) => {
    setDragOver(false);

    if (!selectedAttribute && leader) {
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
    setDropErr(undefined);

    setDragOver(false);
  }, [cards]);

  return (
    <Container>
      <InPlay>
        {selectedCard && (
          <Card
            selected
            next
            card={selectedCard}
            selectedAttr={selectedAttribute}
            onSelectAttribute={onSelectAttribute}
            onDrag={playCard}
            onTouchEnd={onDrop}
          />
        )}
      </InPlay>
      <ToPlay
        isDraggedOver={isDraggedOver}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        error={dropErr}
        leader={leader}
      >
        {droppedCard && (
          <Card
            played
            next
            card={droppedCard}
            selectedAttr={selectedAttribute}
          />
        )}
      </ToPlay>
    </Container>
  );
};

export default Hand;
