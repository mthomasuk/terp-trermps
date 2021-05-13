import {
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactElement,
} from "react";

import { useHistory, Redirect, RouteComponentProps } from "react-router-dom";
import { format } from "date-fns";

import uniqBy from "lodash.uniqby";

import styled from "styled-components";

import { BattleControlContext } from "../components/context/BattleControlStore";
import { UserControlContext } from "../components/context/UserControlStore";
import { useSocket } from "../components/context/Websocket";

import Cards from "../components/molecules/Cards";

interface Props extends RouteComponentProps<{ id: string }> {}

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Share = styled.div`
  font-size: 0.75rem;
`;

const Info = styled.div`
  @media only screen and (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const H2 = styled.h2`
  display: block;
  font-weight: normal;

  @media only screen and (max-width: 768px) {
    & {
      font-size: 1rem;
    }
  }
`;

const Combatants = styled.div`
  padding: 1rem;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1rem;
  width: 100%;
`;

const Battle = ({ match }: Props): ReactElement => {
  const { id } = match.params;

  const [currentBattle, setCurrentBattle] = useState<any>();
  const [currentDecks, setCurrentDecks] = useState<any>([]);

  const { messages, battleHasStarted, battleHasEnded } = useSocket(id);

  const { getSignedInUser } = useContext(UserControlContext);

  const { getBattleById, joinBattle, startBattle, setAttribute, playHand } =
    useContext(BattleControlContext);

  const currentUser = getSignedInUser();
  const userDeck = currentBattle?.decks.find(
    ({ user_id }: any) => user_id === currentUser.id
  );

  const { push } = useHistory();

  const fetchBattle = useCallback(async () => {
    const response = await getBattleById(id);

    if (response && response) {
      setCurrentBattle(response);
    } else {
      push("/");
    }
  }, [getBattleById, setCurrentBattle, push, id]);

  const onStartBattle = async () => {
    await startBattle(id);
    await fetchBattle();
  };

  const onSetAttribute = async (attr: string) => {
    await setAttribute(
      currentBattle?.rounds[currentBattle?.rounds.length - 1].id,
      attr
    );
  };

  const onPlayHand = async (card: any) => {
    await playHand(id, {
      card_id: card.id,
      round_id: currentBattle?.rounds[currentBattle?.rounds.length - 1].id,
      deck_id: userDeck.id,
    });
  };

  const statusMessage =
    currentBattle?.started_at || battleHasStarted
      ? `started at ${format(
          new Date(currentBattle?.started_at as string),
          "HH:mm"
        )}`
      : "hasn't started yet";

  const canStartBattle = !battleHasStarted && !currentBattle?.started_at;
  const battleInProgress = battleHasStarted || currentBattle?.started_at;

  useEffect(() => {
    if (!battleHasStarted) {
      joinBattle(id);
    }
    fetchBattle();
  }, [battleHasStarted, joinBattle, id, fetchBattle]);

  useEffect(() => {
    setCurrentDecks((decks: any) =>
      uniqBy(
        [
          ...decks,
          ...(currentBattle?.decks || []),
          ...messages.filter(({ type }) => type === "user-joined-battle"),
        ],
        "user_id"
      )
    );
  }, [currentBattle, messages]);

  return !battleHasEnded ? (
    <Wrapper>
      <Info>
        <p>
          <strong>Battle:</strong> {id}
        </p>
        <Share>
          <p>Share this link to join the battle:</p>
          <pre>{window.location.href}</pre>
        </Share>
        <H2>
          This battle <strong>{statusMessage}</strong>
        </H2>
        <Combatants>
          {!battleInProgress ? (
            <div>
              {currentDecks.map(({ user_id, name }: any) => (
                <div key={user_id}>{name} is ready to do battle</div>
              ))}
            </div>
          ) : (
            <div>BATTLE HAS COMMENCED</div>
          )}
        </Combatants>
        {canStartBattle && (
          <Buttons>
            <button type="button" onClick={onStartBattle}>
              Start battle
            </button>
          </Buttons>
        )}
        {battleInProgress && (
          <Cards
            cards={userDeck.cards}
            onSetAttribute={onSetAttribute}
            onPlayHand={onPlayHand}
          />
        )}
      </Info>
    </Wrapper>
  ) : (
    <Redirect to={`/battle/${id}/results`} />
  );
};

export default Battle;
