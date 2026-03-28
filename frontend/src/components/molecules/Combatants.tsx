import styled from "styled-components";

interface Combatant {
  user_id: string;
  name: string;
}

interface Props {
  combatants: Combatant[];
}

const Container = styled.div`
  padding: 0.5rem;
`;

export const testIds = {
  ROOT: "combatants-Container",
};

const Combatants = ({ combatants }: Props) => {
  return (
    <Container data-testid={testIds.ROOT}>
      {combatants.map(({ user_id, name }: any, idx: number) =>
        idx === 0 ? (
          <h1 key={user_id}>{name}</h1>
        ) : (
          <span key={`vs-${user_id}`}>
            <h5>VS</h5>
            <h1>{name}</h1>
          </span>
        )
      )}
    </Container>
  );
};

export default Combatants;
