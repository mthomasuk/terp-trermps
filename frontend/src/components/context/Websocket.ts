import { useEffect, useRef, useState } from "react";
import uniqBy from "lodash.uniqby";

import { SocketMessage } from "../../../../types";

import { USER_JOINED_ROUND, ROUND_START, ROUND_END } from "../../constants";

const SOCKET_SERVER_URL =
  process.env.REACT_APP_SOCKETS_URL || "ws://localhost:4002";

let reconnect: any = null;

export function useSocket(id: string) {
  const [messages, setMessages] = useState<SocketMessage[]>([]);

  const [roundHasStarted, startRound] = useState(false);
  const [roundHasEnded, endRound] = useState(false);

  const roundId = useRef(id).current;

  let socketRef: any = useRef();

  useEffect(() => {
    const connect = () => {
      socketRef.current = new WebSocket(`${SOCKET_SERVER_URL}/${roundId}`);

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

              if (type === USER_JOINED_ROUND) {
                const incomingMessage = {
                  ...rest,
                  type,
                };

                setMessages((messages: SocketMessage[]) =>
                  uniqBy([...messages, incomingMessage], "user_id")
                );
              }

              if (type === ROUND_START) {
                startRound(true);
              }

              if (type === ROUND_END) {
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
  }, [roundId]);

  return {
    messages,
    roundHasStarted,
    roundHasEnded,
  };
}
