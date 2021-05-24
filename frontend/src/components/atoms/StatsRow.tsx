import styled from "styled-components";

import { toTitleCase } from "../utils/__helpers__";

interface Props {
  attribute: {
    key: string;
    value: number;
  };
  selected: boolean;
  isAttribute: boolean;
  onSelectAttribute: (attr: string) => void;
}

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

const StatsRow = ({
  attribute: { key, value },
  onSelectAttribute,
  isAttribute = false,
  selected = false,
}: Props) => {
  const onSelect = () => onSelectAttribute(key);

  return (
    <Row selected={selected} onClick={onSelect} isAttr={isAttribute}>
      <span>{toTitleCase(key)}</span>
      <span>{value}</span>
    </Row>
  );
};

export default StatsRow;
