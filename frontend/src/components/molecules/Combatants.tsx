import { useEffect, useState, ReactElement } from "react";

import styled from "styled-components";

import uniqBy from "lodash.uniqby";

interface Props {
  battleInProgress: boolean;
  decks: any[];
}

const Container = styled.div`
  padding: 0.5rem;
`;

const Combatants = ({
  battleInProgress = false,
  decks,
}: Props): ReactElement => {
  const [currentDecks, setCurrentDecks] = useState<any>([]);

  useEffect(() => {
    setCurrentDecks((prev: any) => uniqBy([...prev, ...decks], "user_id"));
  }, [decks]);

  return (
    <Container>
      {!battleInProgress ? (
        <div>
          {currentDecks.map(({ user_id, name }: any) => (
            <div key={user_id}>{name} is ready to do battle</div>
          ))}
        </div>
      ) : (
        <div>BATTLE HAS COMMENCED</div>
      )}
    </Container>
  );
};

export default Combatants;
