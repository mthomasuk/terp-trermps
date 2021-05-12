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

import { RoundControlContext } from "../components/context/RoundControlStore";
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

const Round = ({ match }: Props): ReactElement => {
  const { id } = match.params;

  const [currentRound, setCurrentRound] = useState<any>();
  const [currentHands, setCurrentHands] = useState<any>([]);

  const { messages, roundHasStarted, roundHasEnded } = useSocket(id);

  const { getRoundById, joinRound, startRound } =
    useContext(RoundControlContext);

  const { push } = useHistory();

  const fetchRound = useCallback(async () => {
    const response = await getRoundById(id);

    if (response && response) {
      setCurrentRound(response);
    } else {
      push("/");
    }
  }, [getRoundById, setCurrentRound, push, id]);

  const onStartRound = async () => {
    await startRound(id);
    await fetchRound();
  };

  const statusMessage =
    currentRound?.started_at || roundHasStarted
      ? `started at ${format(
          new Date(currentRound?.started_at as string),
          "HH:mm"
        )}`
      : "hasn't started yet";

  const canStartRound = !roundHasStarted && !currentRound?.started_at;
  const roundInProgress = roundHasStarted || currentRound?.started_at;

  useEffect(() => {
    if (!roundHasStarted) {
      joinRound(id);
    }
    fetchRound();
  }, [roundHasStarted, joinRound, id, fetchRound]);

  useEffect(() => {
    setCurrentHands((hands: any) =>
      uniqBy(
        [
          ...hands,
          ...(currentRound?.hands || []),
          ...messages.filter(({ type }) => type === "user-joined-round"),
        ],
        "user_id"
      )
    );
  }, [currentRound, messages]);

  return !roundHasEnded ? (
    <Wrapper>
      <Info>
        <p>
          <strong>Round:</strong> {id}
        </p>
        <Share>
          <p>Share this link to join the round:</p>
          <pre>{window.location.href}</pre>
        </Share>
        <H2>
          This round <strong>{statusMessage}</strong>
        </H2>
        <Combatants>
          {!roundInProgress ? (
            <div>
              {currentHands.map(({ user_id, name }: any) => (
                <div key={user_id}>{name} is ready to do battle</div>
              ))}
            </div>
          ) : (
            <div>BATTLE HAS COMMENCED</div>
          )}
        </Combatants>
        {canStartRound && (
          <Buttons>
            <button type="button" onClick={onStartRound}>
              Start round
            </button>
          </Buttons>
        )}
        {roundInProgress && <Cards cards={currentRound.hands[0].cards} />}
      </Info>
    </Wrapper>
  ) : (
    <Redirect to={`/round/${id}/results`} />
  );
};

export default Round;
