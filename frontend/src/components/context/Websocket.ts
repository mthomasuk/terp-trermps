import { useEffect, useRef, useState } from "react";
import uniqBy from "lodash.uniqby";

import {
  USER_JOINED_BATTLE,
  BATTLE_START,
  BATTLE_END,
  WINNING_HAND_PLAYED,
} from "../../constants";

const { REACT_APP_SOCKETS_URL } = process.env;

const SOCKET_SERVER_URL = REACT_APP_SOCKETS_URL || "ws://localhost:4002";

let reconnect: any = null;

export function useSocket(id: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [handsWon, setWinningHands] = useState<any[]>([]);

  const [battleHasStarted, startRound] = useState(false);
  const [battleHasEnded, endRound] = useState(false);

  const battleId = useRef(id).current;

  let socketRef: any = useRef();

  useEffect(() => {
    const connect = () => {
      socketRef.current = new WebSocket(`${SOCKET_SERVER_URL}/${battleId}`);

      if (socketRef.current) {
        socketRef.current.addEventListener("open", () => {
          clearInterval(reconnect);
        });

        socketRef.current.addEventListener("close", () => {
          reconnect = setInterval(() => {
            connect();
          }, 50000);
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
                startRound(true);
              }

              if (type === WINNING_HAND_PLAYED) {
                // remove cards from UI
                // force deck refetch
                /*
          				BattleID string `json:"battle_id"`
                  HandID   string `json:"hand_id"`
          				UserID   string `json:"user_id"`
          				Name     string `json:"name"`
                */
              }

              if (type === BATTLE_END) {
                endRound(true);
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
    handsWon,
    battleHasStarted,
    battleHasEnded,
  };
}
