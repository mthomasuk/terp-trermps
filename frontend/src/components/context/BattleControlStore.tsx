import { ReactElement, createContext } from "react";

const createNewBattle = async (): Promise<any> => {
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

const getBattleById = async (id: string): Promise<any> => {
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

const joinBattle = async (id: string): Promise<any> => {
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

const startBattle = async (id: string): Promise<any> => {
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

const endBattle = async (id: string): Promise<any> => {
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
  endBattle,
});

export function BattleControlProvider({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <BattleControlContext.Provider
      value={{
        createNewBattle,
        getBattleById,
        joinBattle,
        startBattle,
        endBattle,
      }}
    >
      {children}
    </BattleControlContext.Provider>
  );
}
