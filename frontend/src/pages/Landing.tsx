import { useContext, ReactElement } from "react";
import { useHistory } from "react-router-dom";

import styled from "styled-components";

import { UserControlContext } from "../components/context/UserControlStore";
import { BattleControlContext } from "../components/context/BattleControlStore";

import Logo from "../components/atoms/Logo";
import Button from "../components/atoms/Button";

const Container = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: calc(10px + 2vmin);
  padding: 0 5rem;

  @media only screen and (max-width: 768px) {
    & {
      padding: 0 2.5rem;
    }
  }
`;

const Disclaimer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  font-size: 0.75rem;
  padding: 1rem;
`;

const Landing = (): ReactElement => {
  const { getSignedInUser } = useContext(UserControlContext);
  const { createNewBattle } = useContext(BattleControlContext);

  const { push } = useHistory();

  const user = getSignedInUser();

  const onClick = async () => {
    const response = await createNewBattle();

    if (response && response.id) {
      push(`/battle/${response.id}`);
    }
  };

  return (
    <Container>
      <Logo />
      <h3>
        Welcome <strong>{user && user.name}</strong>
      </h3>
      <Button onClick={onClick}>Start New Battle</Button>
      <Disclaimer>
        I do not own any of the images or text on this site - it all belongs to
        Waddingtons or whatever mega-corporation bought them out years ago.
        <br />
        Code is my own, with the obvious exception of stuff I have liberally
        stolen from previous colleagues, stackoverflow etc. etc.
        <br />
        HaCk ThE pLaNeT
      </Disclaimer>
    </Container>
  );
};

export default Landing;
