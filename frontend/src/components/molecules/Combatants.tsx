import { useEffect, useState } from "react";

import styled from "styled-components";

import uniqBy from "lodash.uniqby";

interface Props {
  combatants: any[];
}

const Container = styled.div`
  padding: 0.5rem;
`;

const Combatants = ({ combatants }: Props) => {
  const [currentCombatants, setCurrentCombatants] = useState<any>([]);

  useEffect(() => {
    setCurrentCombatants((prev: any) =>
      uniqBy([...prev, ...combatants], "user_id")
    );
  }, [combatants]);

  return (
    <Container>
      <div>
        {currentCombatants.map(({ user_id, name }: any, idx: number) =>
          idx === 0 ? (
            <h1 key={user_id}>{name}</h1>
          ) : (
            <span key={user_id}>
              <h5>VS</h5>
              <h1 key={user_id}>{name}</h1>
            </span>
          )
        )}
      </div>
    </Container>
  );
};

export default Combatants;
