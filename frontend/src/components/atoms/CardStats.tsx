import styled from "styled-components";

import StatsRow from "./StatsRow";

interface Props {
  card: any;
  selected?: boolean;
  selectedAttr?: string;
  onSelectAttribute?: (attr: any) => void;
}

const STATS = ["strength", "skill", "magical_force", "weapons", "power"];

const Stats = styled.div``;

const Card = ({
  card,
  onSelectAttribute,
  selectedAttr,
  selected = false,
}: Props) => {
  const onSelect = (attr: any) =>
    onSelectAttribute ? onSelectAttribute(attr) : {};

  return (
    <Stats>
      {STATS.map((stat: string) => (
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
