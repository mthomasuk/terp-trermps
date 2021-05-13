import { ReactElement } from "react";

import styled from "styled-components";

interface Props {
  type: string;
}

const EMOJI_MAP: { [key: string]: string } = {
  Dragon: "🐉",
  "Tree Creature": "🌲",
  Minotaur: "🐂",
  Monster: "👹",
  Vampire: "🧛",
  Orc: "👺",
  "Shape Changer": "🐙",
  "Ice Beast": "🧊",
  Cyclops: "👁️",
  "Swamp Beast": "🥬",
  Ogre: "👹",
  Firedrake: "🔥",
  Centaur: "🐎",
  Blob: "🥩",
  Serpent: "🐍",
  Giant: "🚶‍♂️",
  Troll: "👺",
  Mutant: "🤢",
  Griffin: "🦅",
  Golem: "🗿",
  Ghoul: "👻",
  Werewolf: "🐺",
};

const Moji = styled.div`
  padding-top: 0.5rem;
  text-align: center;
  font-size: 6.5rem;
  width: 100%;
`;

const Glyph = ({ type }: Props): ReactElement => (
  <Moji>{EMOJI_MAP[type] || "✨"}</Moji>
);

export default Glyph;
