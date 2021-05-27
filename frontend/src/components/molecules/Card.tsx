import { TouchEvent } from "react";

import styled, { css, keyframes } from "styled-components";

import CardImage from "../atoms/CardImage";
import FrontFace from "../atoms/FrontFace";
import BackFace from "../atoms/BackFace";
import CardStats from "../atoms/CardStats";

interface Props {
  card: CardInterface;
  next?: boolean;
  played?: boolean;
  winner?: boolean;
  selected?: boolean;
  selectedAttr?: string;
  onSelectCard?: (card: CardInterface) => void;
  onSelectAttribute?: (attr: string) => void;
  onDrag?: (card: CardInterface) => void;
  onTouchEnd?: (event: TouchEvent, card?: CardInterface) => void;
  dataTestId?: string;
}

const flip = keyframes`
  0% {
    transform: rotateY(360deg);
  }

  25% {
    transform: rotateY(270deg);
  }

  50% {
    transform: rotateY(180deg);
  }

  75% {
    transform: rotateY(90deg);
  }

  100% {
    transform: rotateY(0deg);
  }
`;

const flippy = () =>
  css`
    ${flip} 2s linear infinite;
  `;

export const testIds = {
  ROOT: "card-Wrapper",
};

const Wrapper = styled.button<{
  selected?: boolean;
  played?: boolean;
  next?: boolean;
}>`
  cursor: pointer;
  border: 0;
  background-color: transparent;
  perspective: 1000px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  margin-right: ${({ played, selected }) =>
    played || selected ? "0" : "-197px"};
  padding: 0.5rem;
  width: 200px;
  min-width: 200px;
  min-height: 352px;
  z-index: 1;
  transition: transform 0.25s ease-in-out;

  &:first-of-type {
    margin-right: 0px;
  }

  ${({ selected, next }) =>
    !selected && next
      ? `&:hover {
      transform: translateY(-30px);
      z-index: 2;
    }`
      : ""}

  ${({ played }) =>
    played
      ? `
    box-shadow:
      0 0 30px 15px #fff,
      0 0 30px 10px #e3c20f;
    `
      : ""}
`;

const Inner = styled.div<{
  next?: boolean;
  winner?: boolean;
}>`
  border: solid 1px #dedede;
  box-shadow: 1px 1px 1px #dedede;
  border-radius: 7px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  animation: ${({ winner }) => (winner ? flippy : "")}
    ${({ next }) => {
      if (!next) {
        return "transform: rotateY(180deg);";
      }
    }};
`;

const Info = styled.div`
  border: solid 1px #dedede;
  padding: 0.5rem;
  width: 95%;
`;

const Type = styled.p`
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0.3rem 0;
  text-transform: uppercase;
`;

const Name = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.3rem 0;
  text-transform: uppercase;
`;

const Card = ({
  card,
  onSelectCard,
  onSelectAttribute,
  onDrag,
  onTouchEnd,
  selectedAttr,
  played = false,
  selected = false,
  next = false,
  winner = false,
  dataTestId = testIds.ROOT,
}: Props) => {
  const onClick = () => (onSelectCard && next ? onSelectCard(card) : {});
  const onPlayCard = () => (onDrag ? onDrag(card) : {});
  const onDrop = (event: TouchEvent) =>
    onTouchEnd && next ? onTouchEnd(event) : {};

  return (
    <Wrapper
      next={next}
      onClick={onClick}
      onDrag={onPlayCard}
      onTouchStart={onPlayCard}
      onTouchEnd={onDrop}
      played={played}
      selected={selected}
      draggable={selected}
      data-testid={dataTestId}
    >
      <Inner next={next} winner={winner}>
        <FrontFace>
          <CardImage name={card.name} />
          <Info>
            <Type>{card.type}</Type>
            <Name>{card.name}</Name>
            <CardStats
              card={card}
              selected={selected}
              selectedAttr={selectedAttr}
              onSelectAttribute={onSelectAttribute}
            />
          </Info>
        </FrontFace>
        <BackFace />
      </Inner>
    </Wrapper>
  );
};

export default Card;
