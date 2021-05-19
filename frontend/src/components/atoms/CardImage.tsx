import { ReactElement } from "react";

import styled from "styled-components";

import aegish from "../../assets/images/aegish.png";
import aluf from "../../assets/images/aluf.png";
import apus from "../../assets/images/apus.png";
import aquila from "../../assets/images/aquila.png";
import arbusia from "../../assets/images/arbusia.png";
import avestan from "../../assets/images/avestan.png";
import barad from "../../assets/images/barad.png";
import blook from "../../assets/images/blook.png";
import brythoni from "../../assets/images/brythoni.png";
import dunarth from "../../assets/images/dunarth.png";
import grus from "../../assets/images/grus.png";
import gyea from "../../assets/images/gyea.png";
import ignorot from "../../assets/images/ignorot.png";
import kazantatar from "../../assets/images/kazan_tatar.png";
import ket from "../../assets/images/ket.png";
import khosa from "../../assets/images/khosa.png";
import loucheux from "../../assets/images/loucheux.png";
import mackinaw from "../../assets/images/mackinaw.png";
import malus from "../../assets/images/malus.png";
import nivek from "../../assets/images/nivek.png";
import pavo from "../../assets/images/pavo.png";
import slaas from "../../assets/images/slaas.png";
import slan from "../../assets/images/slan.png";
import tchuick from "../../assets/images/tchu_ick.png";
import urs from "../../assets/images/urs.png";
import valencienes from "../../assets/images/valencienes.png";
import vari from "../../assets/images/var.png";
import vulpecula from "../../assets/images/vulpecula.png";
import xof from "../../assets/images/xof.png";

interface Props {
  name: string;
}

const IMAGE_MAP: { [key: string]: string } = {
  aegish,
  aluf,
  apus,
  arbusia,
  aquila,
  avestan,
  barad,
  blook,
  brythoni,
  dunarth,
  grus,
  gyea,
  ignorot,
  "kazan tatar": kazantatar,
  ket,
  khosa,
  loucheux,
  mackinaw,
  malus,
  nivek,
  pavo,
  slaas,
  slan,
  "tchu-ick": tchuick,
  urs,
  valencienes,
  var: vari,
  vulpecula,
  xof,
};

const Img = styled.div<{ url: string }>`
  ${({ url }) => {
    return `
      background: url("${url}");
      background-size: cover;
      background-position: 0 -10px;
      height: 168px;
      width: 188px;
    `;
  }}
`;

const CardImage = ({ name }: Props): ReactElement => (
  <Img url={IMAGE_MAP[name.toLowerCase()] || ""} />
);

export default CardImage;
