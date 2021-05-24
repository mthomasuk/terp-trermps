import styled from "styled-components";

import StatsRow from "./StatsRow";

import { ATTRIBUTES } from "../../constants";

interface Props {
  card: CardInterface;
  selected?: boolean;
  selectedAttr?: string;
  onSelectAttribute?: (attr: string) => void;
}

const Stats = styled.div``;

const Card = ({
  card,
  onSelectAttribute,
  selectedAttr,
  selected = false,
}: Props) => {
  const onSelect = (attr: string) =>
    onSelectAttribute ? onSelectAttribute(attr) : {};

  return (
    <Stats>
      {ATTRIBUTES.map((stat: string) => (
        <StatsRow
          key={stat}
          attribute={{ key: stat, value: card[stat] }}
          selected={selected}
          isAttribute={selectedAttr === stat}
          onSelectAttribute={onSelect}
        />
      ))}
    </Stats>
  );
};

export default Card;
