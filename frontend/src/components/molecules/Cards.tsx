import { useState, ReactElement } from "react";

import styled from "styled-components";

import Card from "../atoms/Card";

interface Props {
  cards: any[];
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
  const [selectedCard, selectCard] = useState<any | undefined>();
  const [selectedAttr, selectAttr] = useState<string | undefined>();

  const onSelect = (card: any) => {
    selectAttr(undefined);
    selectCard(card);
  };

  const onSelectAttribute = (attr: string) =>
    selectAttr((prev) => (attr === prev ? undefined : attr));

  return (
    <Container>
      <Deck>
        {cards &&
          cards
            .filter(({ id }) => id !== selectedCard?.id)
            .map((card: any) => (
              <Card key={card.id} card={card} onSelectCard={onSelect} />
            ))}
      </Deck>
      <Hand>
        <InPlay>
          {selectedCard && (
            <Card
              selected
              card={selectedCard}
              selectedAttr={selectedAttr}
              onSelectAttribute={onSelectAttribute}
            />
          )}
        </InPlay>
      </Hand>
    </Container>
  );
};

export default Cards;
