import { ReactElement } from "react";

import styled, { css, keyframes } from "styled-components";

import Glyph from "../atoms/Glyph";
import FrontFace from "../atoms/FrontFace";
import BackFace from "../atoms/BackFace";
import CardStats from "../atoms/CardStats";

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

const Wrapper = styled.button`
  cursor: pointer;
  border: 0;
  background-color: transparent;
  perspective: 1000px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  margin-right: 0px;
  padding: 0.5rem;
  width: 200px;
  min-width: 200px;
  min-height: 312px;
  z-index: 1;
  transition: transform 0.25s ease-in-out;

  &:first-of-type {
    margin-right: 0px;
  }
`;

const Inner = styled.div`
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
  animation: ${flippy};
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

const fakeCard = {
  id: "fake-card-uuid",
  name: "?",
  type: "?",
  strength: "?",
  skill: "?",
  magical_force: "?",
  weapons: "?",
  power: "?",
};

const FakeCard = (): ReactElement => (
  <Wrapper>
    <Inner>
      <FrontFace>
        <Glyph type={fakeCard.type} />
        <Info>
          <Type>{fakeCard.type}</Type>
          <Name>{fakeCard.name}</Name>
          <CardStats card={fakeCard} />
        </Info>
      </FrontFace>
      <BackFace />
    </Inner>
  </Wrapper>
);

export default FakeCard;
