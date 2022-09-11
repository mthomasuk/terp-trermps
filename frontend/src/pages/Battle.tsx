import { useState, useEffect, useContext, useCallback, useMemo } from "react";

import styled from "styled-components";

import uniqBy from "lodash.uniqby";

import { useHistory, Redirect, RouteComponentProps } from "react-router-dom";

import { BattleControlContext } from "../components/context/BattleControlStore";
import { UserControlContext } from "../components/context/UserControlStore";
import { useSocket } from "../components/context/Websocket";

import Loader from "../components/atoms/Loader";
import Button from "../components/atoms/Button";
import Disappear from "../components/atoms/Disappear";
import MiniLogo from "../components/atoms/MiniLogo";

import BattleStatus from "../components/molecules/BattleStatus";
import Card from "../components/molecules/Card";
import FakeCard from "../components/molecules/FakeCard";
import Cards from "../components/molecules/Cards";
import Combatants from "../components/molecules/Combatants";
import EnemiesCrushed from "../components/molecules/EnemiesCrushed";

import { USER_JOINED_BATTLE } from "../constants";

interface Props extends RouteComponentProps<{ id: string }> {}

const Share = styled.div`
  font-size: 0.75rem;
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const Info = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  width: 100%;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Battle = ({ match }: Props) => {
  const { id } = match.params;

  const [currentBattle, setCurrentBattle] = useState<any>();

  const { messages, winningHand, battleHasStarted, battleHasEnded } =
    useSocket(id);

  const { getSignedInUser } = useContext(UserControlContext);

  const { getBattleById, joinBattle, startBattle, playHand } =
    useContext(BattleControlContext);

  const { push } = useHistory();

  const currentUser = getSignedInUser();

  const [currentRound] = currentBattle?.rounds || [];

  const isLeader = currentUser?.id === currentRound?.leader;

  const fightersInArena = uniqBy(
    [
      ...(currentBattle ? currentBattle.decks : []),
      ...(messages
        ? messages.filter(({ type }) => type === USER_JOINED_BATTLE)
        : []),
    ],
    "user_id"
  );

  const canStartBattle =
    !battleHasStarted &&
    !currentBattle?.started_at &&
    fightersInArena.length > 1;

  const battleInProgress = battleHasStarted || currentBattle?.started_at;
  const enemiesCrushed = battleHasEnded || currentBattle?.winner;

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

  const userDeck = useMemo(
    () =>
      (currentBattle?.decks || []).find(
        ({ user_id }: any) => user_id === currentUser.id
      ),
    [currentBattle?.decks, currentUser.id]
  );

  const totalCards = useMemo(
    () => (userDeck?.cards?.length ?? 0) * (currentBattle?.decks?.length ?? 0),
    [userDeck?.cards, currentBattle?.decks]
  );

  const onPlayHand = async (card: any) => {
    await playHand(id, {
      card_id: card.id,
      round_id: currentRound.id,
      deck_id: userDeck.id,
    });
  };

  useEffect(() => {
    if (!battleHasStarted) {
      joinBattle(id);
    }
    fetchBattle();
  }, [id, battleHasStarted, joinBattle, fetchBattle]);

  useEffect(() => {
    fetchBattle();
  }, [fetchBattle, winningHand]);

  if (!currentBattle) {
    return <Loader />;
  }

  if (enemiesCrushed) {
    return <EnemiesCrushed victor={{ id: currentBattle?.winner as string }} />;
  }

  return !battleHasEnded ? (
    <>
      <Info>
        <Share>
          <p>Share this link to join the battle:</p>
          <pre>{window.location.href}</pre>
        </Share>
        <BattleStatus
          isLeader={isLeader}
          battleInProgress={battleInProgress}
          selectedAttr={currentRound?.attribute}
          noOfCards={userDeck?.cards?.length ?? 0}
          totalCards={totalCards}
        />
        {!battleInProgress && <Combatants combatants={fightersInArena} />}
        {canStartBattle && (
          <Buttons>
            <Button onClick={onStartBattle}>⚔️ Start battle ⚔️</Button>
          </Buttons>
        )}
        {battleInProgress && (
          <Cards
            leader={isLeader}
            cards={userDeck?.cards}
            roundId={currentRound?.id}
            onPlayHand={onPlayHand}
            selectedAttr={currentRound?.attribute}
          />
        )}
        <Footer>
          <MiniLogo />
        </Footer>
      </Info>
      {winningHand && winningHand.card && (
        <Disappear
          headline="WINNING HAND"
          info={
            <span>
              Played by: <strong>{winningHand.name}</strong>
            </span>
          }
          element={
            <>
              <Card next winner card={winningHand.card} />
            </>
          }
        />
      )}
      {winningHand && !winningHand.card && (
        <Disappear
          headline="ROUND WAS A DRAW"
          info={<span>No winner</span>}
          element={<FakeCard />}
        />
      )}
    </>
  ) : (
    <Redirect to={`/battle/${id}/results`} />
  );
};

export default Battle;
