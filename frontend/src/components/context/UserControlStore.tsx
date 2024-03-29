import { useState, useEffect, createContext, ReactNode } from "react";
import { useHistory } from "react-router-dom";

const hasCookie: boolean = document.cookie.includes("session");

const getSignedInUser = (): any =>
  window.localStorage.getItem("user")
    ? JSON.parse(window.localStorage.getItem("user") as string)
    : null;

const clearExpressCookies = (): void => {
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0];
    if (cookieName.includes("session")) {
      const value = "";
      document.cookie = `${cookieName}=${value};expires=Thu, 21 Sep 1979 00:00:01 UTC;path=/`;
    }
  });
};

export const UserControlContext = createContext({
  isSignedIn: false,
  getSignedInUser,
  signInUser: async (_: string, __: string) => Promise.resolve(),
  signOutUser: async () => {},
});

export function UserControlProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(hasCookie);

  const history = useHistory();

  const signInUser = async (name: string, password: string): Promise<void> => {
    window.localStorage.removeItem("user");

    const user = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("INVALID CREDENTIALS");
        }

        return response.json();
      })
      .then((data) => data);

    setIsSignedIn(true);

    window.localStorage.setItem("user", JSON.stringify(user));

    return;
  };

  const signOutUser = async (): Promise<void> => {
    clearExpressCookies();

    window.localStorage.removeItem("user");

    setIsSignedIn(false);

    history?.push("/login");
  };

  useEffect(() => {
    if (hasCookie) {
      setIsSignedIn(true);
    }
  }, [isSignedIn]);

  return (
    <UserControlContext.Provider
      value={{
        isSignedIn,
        getSignedInUser,
        signInUser,
        signOutUser,
      }}
    >
      {children}
    </UserControlContext.Provider>
  );
}
