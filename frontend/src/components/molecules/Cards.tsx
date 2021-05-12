import { useState, ReactElement } from "react";

import styled from "styled-components";

import Card from "../atoms/Card";

import { Card as CardType } from "../../../../types";

interface Props {
  cards: CardType[];
}

const Container = styled.div``;

const Deck = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -60px;
  padding: 1rem;
  padding-top: 3rem;
  overflow-x: scroll;
  overflow-y: visible;
`;

const Hand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const InPlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #333;
  border-radius: 4px;
  height: 324px;
  width: 210px;
  display: flex;
`;

const Cards = ({ cards }: Props): ReactElement => {
  const [selectedCard, selectCard] = useState<CardType | null>();

  const onSelect = (card: CardType) => selectCard(card);
  const onDeselect = (_: CardType) => selectCard(null);

  return (
    <Container>
      <Deck>
        {cards &&
          cards
            .filter(({ id }) => id !== selectedCard?.id)
            .map((card: CardType) => (
              <Card key={card.id} card={card} onSelect={onSelect} />
            ))}
      </Deck>
      <Hand>
        <InPlay>
          {selectedCard && (
            <Card card={selectedCard} selected onSelect={onDeselect} />
          )}
        </InPlay>
      </Hand>
    </Container>
  );
};

export default Cards;
