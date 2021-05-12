import { StrictMode, ReactElement } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { UserControlProvider } from "./components/context/UserControlStore";
import { RoundControlProvider } from "./components/context/RoundControlStore";
import { ProtectedRoute } from "./components/utils/ProtectedRoute";

import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import RoundPage from "./pages/Round";

import "./index.css";

const App = (): ReactElement => (
  <StrictMode>
    <UserControlProvider>
      <RoundControlProvider>
        <Router>
          <Switch>
            <Route component={LoginPage} exact path={"/login"} />
            <ProtectedRoute component={LandingPage} exact path={"/"} />
            <ProtectedRoute component={RoundPage} exact path={"/round/:id"} />
          </Switch>
        </Router>
      </RoundControlProvider>
    </UserControlProvider>
  </StrictMode>
);

ReactDOM.render(<App />, document.getElementById("root"));
