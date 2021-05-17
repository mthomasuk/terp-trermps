import { useEffect, useState, ReactElement } from "react";

import styled from "styled-components";

import uniqBy from "lodash.uniqby";

interface Props {
  battleInProgress: boolean;
  combatants: any[];
}

const Container = styled.div`
  padding: 0.5rem;
`;

const Combatants = ({
  battleInProgress = false,
  combatants,
}: Props): ReactElement => {
  const [currentCombatants, setCurrentCombatants] = useState<any>([]);

  useEffect(() => {
    setCurrentCombatants((prev: any) =>
      uniqBy([...prev, ...combatants], "user_id")
    );
  }, [combatants]);

  return (
    <Container>
      {!battleInProgress ? (
        <div>
          {currentCombatants.map(({ user_id, name }: any) => (
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
