import { ReactElement } from "react";

import styled, { css, keyframes } from "styled-components";

import Glyph from "../atoms/Glyph";
import FrontFace from "../atoms/FrontFace";
import BackFace from "../atoms/BackFace";
import CardStats from "../atoms/CardStats";

interface Props {
  card: any;
  next?: boolean;
  played?: boolean;
  winner?: boolean;
  selected?: boolean;
  selectedAttr?: string;
  onSelectCard?: (card: any) => void;
  onSelectAttribute?: (attr: any) => void;
  onDrag?: (card: any) => void;
  onTouch?: (event: any, card?: any) => void;
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
  min-height: 312px;
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
  box-shadow: 2px 2px 2px #ededed;
  border-radius: 4px;
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
  onTouch,
  selectedAttr,
  played = false,
  selected = false,
  next = false,
  winner = false,
}: Props): ReactElement => {
  const onClick = () => (onSelectCard && next ? onSelectCard(card) : {});
  const onPlayCard = () => (onDrag ? onDrag(card) : {});
  const onTouchStart = (event: any) =>
    onTouch && next ? onTouch(event, card) : {};

  return (
    <Wrapper
      next={next}
      onClick={onClick}
      onDrag={onPlayCard}
      onTouchStart={onTouchStart}
      played={played}
      selected={selected}
      draggable={selected}
    >
      <Inner next={next} winner={winner}>
        <FrontFace>
          <Glyph type={card.type} />
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
