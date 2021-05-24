import { useState, useEffect, createContext, ReactNode } from "react";

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
      document.cookie = `${cookieName}=${value};expires=Thu, 21 Sep 1979 00:00:01 UTC;domain=.${process.env.BASE_URL};path=/`;
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

  const signInUser = async (name: string, password: string): Promise<void> => {
    window.localStorage.removeItem("user");

    try {
      const user = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ name, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => data);

      setIsSignedIn(true);

      window.localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.warn(error);
    }

    return;
  };

  const signOutUser = async (): Promise<void> => {
    clearExpressCookies();

    window.localStorage.removeItem("user");

    setIsSignedIn(false);
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
