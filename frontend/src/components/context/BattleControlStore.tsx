import { createContext, ReactNode } from "react";

const createNewBattle = async (): Promise<BattleInterface | void> => {
  try {
    const newBattle = await fetch("/api/battle/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return newBattle;
  } catch (error) {
    console.warn(error);
  }

  return;
};

const getBattleById = async (id: string): Promise<BattleInterface | void> => {
  try {
    const battle = await fetch(`/api/battle/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return battle;
  } catch (error) {
    console.warn(error);
  }

  return;
};

const joinBattle = async (id: string): Promise<BattleInterface | void> => {
  try {
    const newHand = await fetch(`/api/battle/${id}`, {
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

const startBattle = async (id: string): Promise<BattleInterface | void> => {
  try {
    const battle = await fetch(`/api/battle/${id}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return battle;
  } catch (error) {
    console.warn(error);
  }

  return;
};

const setAttribute = async (
  roundId: string,
  attribute: string
): Promise<string | void> => {
  try {
    const response = await fetch(`/api/round/${roundId}/attribute`, {
      method: "POST",
      body: JSON.stringify({ attribute }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return response;
  } catch (error) {
    console.warn(error);
  }

  return;
};

const playHand = async (
  id: string,
  hand: HandInterface
): Promise<RoundInterface | void> => {
  try {
    const response = await fetch(`/api/hand/${id}`, {
      method: "POST",
      body: JSON.stringify(hand),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return response;
  } catch (error) {
    console.warn(error);
  }

  return;
};

const endBattle = async (id: string): Promise<BattleInterface | void> => {
  try {
    const battle = await fetch(`/api/battle/${id}/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    return battle;
  } catch (error) {
    console.warn(error);
  }

  return;
};

export const BattleControlContext = createContext({
  createNewBattle,
  getBattleById,
  joinBattle,
  startBattle,
  setAttribute,
  playHand,
  endBattle,
});

export function BattleControlProvider({ children }: { children: ReactNode }) {
  return (
    <BattleControlContext.Provider
      value={{
        createNewBattle,
        getBattleById,
        joinBattle,
        startBattle,
        setAttribute,
        playHand,
        endBattle,
      }}
    >
      {children}
    </BattleControlContext.Provider>
  );
}
