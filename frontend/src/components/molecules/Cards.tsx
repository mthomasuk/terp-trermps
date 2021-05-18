import { useState, useEffect, ReactElement } from "react";

import styled from "styled-components";

import Card from "./Card";
import Hand from "./Hand";

interface Props {
  cards: any[];
  selectedAttr?: string;
  roundId: string;
  onPlayHand: (hand: any) => void;
  leader: boolean;
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

const Cards = ({
  cards,
  selectedAttr,
  roundId,
  onPlayHand,
  leader = false,
}: Props): ReactElement => {
  const [selectedCard, selectCard] = useState<any | undefined>();
  const [droppedCard, setDroppedCard] = useState<any | undefined>();

  const onSelect = (card: any) => {
    selectCard(card);
  };

  useEffect(() => {
    setDroppedCard(undefined);
  }, [cards]);

  return (
    <Container>
      <Deck>
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
      <Hand
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
    </Container>
  );
};

export default Cards;
