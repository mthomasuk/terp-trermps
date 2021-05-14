import { ReactElement } from "react";

import styled from "styled-components";

import Glyph from "./Glyph";

interface Props {
  card: any;
  next?: boolean;
  played?: boolean;
  selected?: boolean;
  selectedAttr?: string;
  onSelectCard?: (card: any) => void;
  onSelectAttribute?: (attr: any) => void;
  onDrag?: (card: any) => void;
}

const Wrapper = styled.button<{
  selected?: boolean;
  played?: boolean;
  next?: boolean;
}>`
  cursor: pointer;
  background-color: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  margin-right: ${({ played, selected }) =>
    played || selected ? "0" : "-197px"};
  padding: 0.5rem;
  border: solid 1px #dedede;
  box-shadow: 2px 2px 2px #ededed;
  border-radius: 4px;
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

const Flipped = styled(Wrapper)`
  background-color: #fff;

  &:after {
    background: linear-gradient(135deg, #e1e1e1 25%, transparent 25%) -50px 0,
      linear-gradient(225deg, #e1e1e1 25%, transparent 25%) -50px 0,
      linear-gradient(315deg, #e1e1e1 25%, transparent 25%),
      linear-gradient(45deg, #e1e1e1 25%, transparent 25%);
    background-color: #cfd8dc;
    background-size: 100px 100px;
    border-radius: 4px;
    content: "";
    height: 298px;
    width: 182px;
    position: absolute;
  }
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

const Row = styled.div<{ selected?: boolean; isAttr?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.25s ease-in-out;

  ${({ isAttr }) =>
    isAttr
      ? `
    background-color: #efefef;
    color: #e65252;
    padding: 0.25rem;
    transform: scale(1.05);
  `
      : ""}

  ${({ selected }) =>
    selected
      ? `&:hover {
      background-color: #efefef;
      padding: 0.25rem;
      transform: scale(1.05);
    }`
      : ""}
`;

const Card = ({
  card,
  onSelectCard,
  onSelectAttribute,
  onDrag,
  selectedAttr,
  played = false,
  selected = false,
  next = false,
}: Props): ReactElement => {
  const onClick = () => (onSelectCard ? onSelectCard(card) : {});
  const onPlayCard = () => (onDrag ? onDrag(card) : {});

  const onSelect = (attr: any) =>
    onSelectAttribute ? onSelectAttribute(attr) : {};

  const selectStrength = () => onSelect("strength");
  const selectSkill = () => onSelect("skill");
  const selectMagic = () => onSelect("magical_force");
  const selectWeapons = () => onSelect("weapons");
  const selectPower = () => onSelect("power");

  return next ? (
    <Wrapper
      next
      onClick={onClick}
      onDrag={onPlayCard}
      played={played}
      selected={selected}
      draggable={selected}
    >
      <Glyph type={card.type} />
      <Info>
        <Type>{card.type}</Type>
        <Name>{card.name}</Name>
        <Stats>
          <Row
            selected={selected}
            onClick={selectStrength}
            isAttr={selectedAttr === "strength"}
          >
            <span>Strength</span>
            <span>{card.strength}</span>
          </Row>
          <Row
            selected={selected}
            onClick={selectSkill}
            isAttr={selectedAttr === "skill"}
          >
            <span>Skill</span>
            <span>{card.skill}</span>
          </Row>
          <Row
            selected={selected}
            onClick={selectMagic}
            isAttr={selectedAttr === "magical_force"}
          >
            <span>Magical Force</span>
            <span>{card.magical_force}</span>
          </Row>
          <Row
            selected={selected}
            onClick={selectWeapons}
            isAttr={selectedAttr === "weapons"}
          >
            <span>Weapons</span>
            <span>{card.weapons}</span>
          </Row>
          <Row
            selected={selected}
            onClick={selectPower}
            isAttr={selectedAttr === "power"}
          >
            <span>Power</span>
            <span>{card.power}</span>
          </Row>
        </Stats>
      </Info>
    </Wrapper>
  ) : (
    <Flipped />
  );
};

export default Card;
