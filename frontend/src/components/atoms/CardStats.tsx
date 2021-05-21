import styled from "styled-components";

interface Props {
  card: any;
  selected?: boolean;
  selectedAttr?: string;
  onSelectAttribute?: (attr: any) => void;
}

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
  onSelectAttribute,
  selectedAttr,
  selected = false,
}: Props) => {
  const onSelect = (attr: any) =>
    onSelectAttribute ? onSelectAttribute(attr) : {};

  const selectStrength = () => onSelect("strength");
  const selectSkill = () => onSelect("skill");
  const selectMagic = () => onSelect("magical_force");
  const selectWeapons = () => onSelect("weapons");
  const selectPower = () => onSelect("power");

  return (
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
  );
};

export default Card;
