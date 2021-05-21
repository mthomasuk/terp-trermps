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

const MAX_RETRIES = 10;
const THIRTY_SECONDS = 30000;

let reconnect: any = null;
let socketRetries: number = 0;

export function useSocket(id: string) {
  const [messages, setMessages] = useState<any[]>([]);

  const [winningHand, setWinningHand] = useState<any | undefined>();
  const [attributeSelected, setAttribute] = useState<string | undefined>();

  const [battleHasStarted, startBattle] = useState(false);
  const [battleHasEnded, endBattle] = useState(false);

  const battleId = useRef(id).current;

  let socketRef: any = useRef();

  useEffect(() => {
    const connect = () => {
      socketRef.current = new WebSocket(`${SOCKET_SERVER_URL}/ws/${battleId}`);

      if (socketRef.current) {
        socketRef.current.addEventListener("open", () => {
          clearInterval(reconnect);
          socketRetries = 0;
        });

        socketRef.current.addEventListener("close", () => {
          reconnect = setInterval(() => {
            if (socketRetries < MAX_RETRIES) {
              connect();
              socketRetries++;
            } else {
              clearInterval(reconnect);
            }
          }, THIRTY_SECONDS);
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
            console.info({ data });
          }
        });
      }
    };

    connect();

    return () => {
      clearInterval(reconnect);
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
