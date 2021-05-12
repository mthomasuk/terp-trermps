import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { UserControlContext } from "../context/UserControlStore";

export const ProtectedRoute = ({ component: Component, ...args }: any) => {
  const { isSignedIn } = useContext(UserControlContext);

  return (
    <Route
      {...args}
      render={(props) =>
        isSignedIn ? <Component {...props} /> : <Redirect to={"/login"} />
      }
    />
  );
};
