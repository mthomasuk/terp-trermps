import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";

import { useSocket } from "../context/Websocket";

import Card from "./Card";
import Hand from "./Hand";

interface Props {
  cards: CardInterface[];
  roundId: string;
  onPlayHand: (card: CardInterface | undefined) => void;
  leader: boolean;
  selectedAttr?: string;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  @media only screen and (max-width: 768px) {
    & {
      flex-direction: column;
      justify-content: flex-start;
    }
  }
`;

const Deck = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: row-reverse;
  margin: 0;
  padding: 1rem;
  padding-top: 2rem;
`;

export const testIds = {
  ROOT: "cards-Container",
  DECK: "cards-Deck",
  HAND: "cards-Hand",
};

const Cards = ({
  cards,
  roundId,
  onPlayHand,
  selectedAttr,
  leader = false,
}: Props) => {
  const { id }: any = useParams();

  const { attributeSelected } = useSocket(id);

  const [selectedCard, selectCard] = useState<any | undefined>();
  const [droppedCard, setDroppedCard] = useState<any | undefined>();

  const canPlayHand = leader || attributeSelected || selectedAttr;

  const onSelect = (card: CardInterface) => {
    if (canPlayHand) {
      selectCard(card);
    }
  };

  useEffect(() => {
    setDroppedCard(undefined);
  }, [cards]);

  return (
    <Container data-testid={testIds.ROOT}>
      <Deck data-testid={testIds.DECK}>
        {cards &&
          cards
            .filter(
              ({ id }) => id !== selectedCard?.id && id !== droppedCard?.id
            )
            .map((card: any, idx: number) => (
              <Card
                key={card.id}
                next={idx === cards.length - 1}
                card={card}
                onSelectCard={onSelect}
              />
            ))}
      </Deck>
      {canPlayHand && (
        <Hand
          dataTestId={testIds.HAND}
          cards={cards}
          roundId={roundId}
          onPlayHand={onPlayHand}
          leader={leader}
          selectedCard={selectedCard}
          selectedAttr={selectedAttr}
          droppedCard={droppedCard}
          onSelectCard={selectCard}
          onSetDroppedCard={setDroppedCard}
        />
      )}
    </Container>
  );
};

export default Cards;
