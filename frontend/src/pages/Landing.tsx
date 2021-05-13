import { useContext, ReactElement } from "react";
import { useHistory } from "react-router-dom";

import styled from "styled-components";

import { UserControlContext } from "../components/context/UserControlStore";
import { BattleControlContext } from "../components/context/BattleControlStore";

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
    <>
      <Container>
        <h2>
          hi <strong>{user && user.name}</strong>
        </h2>
        <button onClick={onClick}>Start New Battle</button>
      </Container>
    </>
  );
};

export default Landing;
