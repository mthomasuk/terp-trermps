import { useEffect, useRef, useState } from "react";
import uniqBy from "lodash.uniqby";

import {
  USER_JOINED_BATTLE,
  BATTLE_START,
  BATTLE_END,
  WINNING_HAND_PLAYED,
  ROUND_IS_A_DRAW,
  ROUND_ATTRIBUTE_SELECTED,
} from "../../constants";

const { REACT_APP_SOCKETS_URL } = process.env;

const SOCKET_SERVER_URL =
  REACT_APP_SOCKETS_URL === "/"
    ? `wss://${window.location.host}`
    : "ws://localhost:4002";

const MAX_RETRIES = 5;

const THIRTY_SECONDS = 30000;
const FIVE_SECONDS = 5000;

export function useSocket(id: string) {
  const [messages, setMessages] = useState<any[]>([]);

  const [winningHand, setWinningHand] = useState<any | undefined>();
  const [attributeSelected, setAttribute] = useState<string | undefined>();

  const [battleHasStarted, startBattle] = useState(false);
  const [battleHasEnded, endBattle] = useState(false);

  const battleId = useRef(id).current;

  const socketRef: any = useRef();
  const reconnectRef = useRef<any>(null);
  const pingPongRef = useRef<any>(null);
  const socketRetriesRef = useRef<number>(0);

  useEffect(() => {
    const connect = () => {
      socketRef.current = new WebSocket(`${SOCKET_SERVER_URL}/ws/${battleId}`);

      if (socketRef.current) {
        socketRef.current.addEventListener("open", () => {
          clearInterval(reconnectRef.current);

          socketRetriesRef.current = 0;

          pingPongRef.current = setInterval(() => {
            if (socketRef.current.readyState !== 1) {
              return;
            }

            socketRef.current.send("PING");
          }, THIRTY_SECONDS);
        });

        socketRef.current.addEventListener("close", () => {
          reconnectRef.current = setInterval(() => {
            if (socketRetriesRef.current < MAX_RETRIES) {
              connect();
              socketRetriesRef.current++;
            } else {
              clearInterval(reconnectRef.current);
              clearInterval(pingPongRef.current);
            }
          }, FIVE_SECONDS);
        });

        socketRef.current.addEventListener("message", ({ data }: any) => {
          try {
            const msgs = data.split("\n");

            msgs.forEach((msg: string) => {
              const { type, ...rest } = JSON.parse(msg);

              if (type === USER_JOINED_BATTLE) {
                const incomingMessage = {
                  ...rest,
                  type,
                };

                setMessages((messages: any[]) =>
                  uniqBy([...messages, incomingMessage], "user_id")
                );
              }

              if (type === BATTLE_START) {
                startBattle(true);
              }

              if (type === WINNING_HAND_PLAYED) {
                setWinningHand(undefined);
                setAttribute(undefined);

                setWinningHand({
                  user: rest.user_id,
                  name: rest.name,
                  card: rest.card,
                });
              }

              if (type === ROUND_IS_A_DRAW) {
                setAttribute(undefined);

                setWinningHand({
                  user: null,
                  name: null,
                  card: null,
                });
              }

              if (type === ROUND_ATTRIBUTE_SELECTED) {
                setAttribute(rest.attribute);
              }

              if (type === BATTLE_END) {
                endBattle(true);
              }
            });
          } catch (err) {
            console.warn({ err });
          }
        });
      }
    };

    connect();

    return () => {
      clearInterval(reconnectRef.current);
      clearInterval(pingPongRef.current);

      socketRef?.current?.close();
    };
  }, [battleId]);

  return {
    messages,
    attributeSelected,
    winningHand,
    battleHasStarted,
    battleHasEnded,
  };
}
