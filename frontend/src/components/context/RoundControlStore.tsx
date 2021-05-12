import { ReactElement, createContext } from "react";

const createNewRound = async (): Promise<any> => {
  try {
    const newRound = await fetch("/api/round/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return newRound;
  } catch (error) {
    console.warn(error);
  }

  return;
};

const getRoundById = async (id: string): Promise<any> => {
  try {
    const round = await fetch(`/api/round/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return round;
  } catch (error) {
    console.warn(error);
  }

  return;
};

const joinRound = async (id: string): Promise<any> => {
  try {
    const newHand = await fetch(`/api/hand/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return newHand;
  } catch (error) {
    console.warn(error);
  }

  return;
};

const startRound = async (id: string): Promise<any> => {
  try {
    const round = await fetch(`/api/round/${id}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return round;
  } catch (error) {
    console.warn(error);
  }

  return;
};

const endRound = async (id: string): Promise<any> => {
  try {
    const round = await fetch(`/api/round/${id}/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return round;
  } catch (error) {
    console.warn(error);
  }

  return;
};

export const RoundControlContext = createContext({
  createNewRound,
  getRoundById,
  joinRound,
  startRound,
  endRound,
});

export function RoundControlProvider({ children }: { children: ReactElement }) {
  return (
    <RoundControlContext.Provider
      value={{
        createNewRound,
        getRoundById,
        joinRound,
        startRound,
        endRound,
      }}
    >
      {children}
    </RoundControlContext.Provider>
  );
}
