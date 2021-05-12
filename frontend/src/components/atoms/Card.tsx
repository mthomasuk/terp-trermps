import { ReactElement } from "react";

import styled from "styled-components";

import { Card as CardType } from "../../../../types";

interface Props {
  card: CardType;
  selected?: boolean;
  onSelect?: (card: CardType) => void;
}

const Wrapper = styled.button<{ selected?: boolean }>`
  cursor: pointer;
  background-color: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  margin-right: ${({ selected }) => (selected ? "0" : "-60px")};
  padding: 0.5rem;
  border: solid 1px #dedede;
  box-shadow: 2px 2px 2px #ededed;
  border-radius: 4px;
  width: 200px;
  min-width: 200px;
  z-index: 1;
  transition: transform 0.25s ease-in-out;

  &:hover {
    transform: ${({ selected }) =>
      selected ? "rotate(5deg)" : "translateY(-40px)"};
  }
`;

const Image = styled.img`
  width: 100%;
`;

const Info = styled.div`
  border: solid 1px #dedede;
  padding: 0.5rem;
  width: 100%;
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

const Stats = styled.div``;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Card = ({ card, onSelect, selected = false }: Props): ReactElement => {
  const onClick = () => (onSelect ? onSelect(card) : {});

  return (
    <Wrapper onClick={onClick} selected={selected}>
      <Image src="https://via.placeholder.com/182x130" />
      <Info>
        <Type>{card.type}</Type>
        <Name>{card.name}</Name>
        <Stats>
          <Row>
            <span>Strength</span>
            <span>{card.strength}</span>
          </Row>
          <Row>
            <span>Skill</span>
            <span>{card.skill}</span>
          </Row>
          <Row>
            <span>Magical Force</span>
            <span>{card.magical_force}</span>
          </Row>
          <Row>
            <span>Weapons</span>
            <span>{card.weapons}</span>
          </Row>
          <Row>
            <span>Power</span>
            <span>{card.power}</span>
          </Row>
        </Stats>
      </Info>
    </Wrapper>
  );
};

export default Card;
