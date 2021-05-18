import { useContext, useRef, useEffect, ReactElement } from "react";
import { Link } from "react-router-dom";

import confetti from "canvas-confetti";

import styled from "styled-components";

import { UserControlContext } from "../context/UserControlStore";

import skinner from "../../assets/images/pathetic.png";

interface Props {
  victor: {
    id: string;
    name?: string;
  };
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  text-align: center;
  padding: 5rem;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  pointer-events: none;
`;

const Image = styled.img`
  max-width: 60vw;
  margin: 0 auto;
`;

const EnemiesCrushed = ({ victor }: Props): ReactElement => {
  const ref = useRef();

  const { getSignedInUser } = useContext(UserControlContext);

  const user = getSignedInUser();

  const isVictorious = user.id === victor.id;

  const message = isVictorious
    ? `WARRIOR ${
        victor.name || victor.id
      } (that's you) HAS OBLITERATED THEIR ENEMIES!`
    : `WARRIOR ${victor.name || victor.id} (that's not you) HAS DESTROYED YOU!`;

  useEffect(() => {
    let interval: any;

    const fireConfetti = async () => {
      await confetti({
        particleCount: 120,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
      });
    };

    if (isVictorious && ref.current) {
      interval = setInterval(() => {
        fireConfetti();
      }, 1000);
    }

    return () => {
      if (interval) {
        return clearInterval(interval);
      }
    };
  }, [isVictorious, ref]);

  return (
    <Wrapper>
      {isVictorious && <Canvas ref={ref as any}></Canvas>}
      <h1>{message}</h1>
      {!isVictorious && <Image src={skinner} alt="pathetic" />}
      <p>
        <Link to="/">Return from whence you came</Link>
      </p>
    </Wrapper>
  );
};

export default EnemiesCrushed;
