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
  margin: 0 1rem;
  height: 324px;
  width: 210px;
  display: flex;
  position: relative;

  &:after {
    position: absolute;
    color: #acacac;
    content: "Click to play card";
    font-size: 1.5rem;
    text-transform: uppercase;
  }
`;

const ToPlay = styled(InPlay)<{ isDraggedOver?: boolean }>`
  transition: transform 0.25s ease-in-out;

  &:after {
    position: absolute;
    color: #acacac;
    content: "Drop to play card";
    font-size: 1.5rem;
    text-transform: uppercase;
  }

  ${({ isDraggedOver }) =>
    isDraggedOver
      ? `
  transform: scale(1.05);
  `
      : ""}
`;

const Cards = ({ cards }: Props): ReactElement => {
  const [selectedCard, selectCard] = useState<any | undefined>();
  const [cardInPlay, playCard] = useState<any | undefined>();
  const [droppedCard, setDroppedCard] = useState<any | undefined>();

  const [selectedAttr, selectAttr] = useState<string | undefined>();

  const [isDraggedOver, setDragOver] = useState<boolean>(false);

  const onSelect = (card: any) => {
    selectAttr(undefined);
    selectCard(card);
  };

  const onSelectAttribute = (attr: string) =>
    selectAttr((prev) => (attr === prev ? undefined : attr));

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

    if (!selectedAttr) return false;

    event.stopPropagation();

    selectCard(undefined);
    setDroppedCard(cardInPlay);

    console.info({
      cardInPlay,
      selectedAttr,
      value: selectedAttr ? cardInPlay[selectedAttr] : "",
    });
  };

  return (
    <Container>
      <Deck>
        {cards &&
          cards
            .filter(
              ({ id }) => id !== selectedCard?.id && id !== droppedCard?.id
            )
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
              onDrag={playCard}
            />
          )}
        </InPlay>
        <ToPlay
          isDraggedOver={isDraggedOver}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {droppedCard && (
            <Card played card={droppedCard} selectedAttr={selectedAttr} />
          )}
        </ToPlay>
      </Hand>
    </Container>
  );
};

export default Cards;
