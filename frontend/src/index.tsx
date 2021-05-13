import { StrictMode, ReactElement } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { UserControlProvider } from "./components/context/UserControlStore";
import { BattleControlProvider } from "./components/context/BattleControlStore";
import { ProtectedRoute } from "./components/utils/ProtectedRoute";

import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import BattlePage from "./pages/Battle";

import "./index.css";

const App = (): ReactElement => (
  <StrictMode>
    <UserControlProvider>
      <BattleControlProvider>
        <Router>
          <Switch>
            <Route component={LoginPage} exact path={"/login"} />
            <ProtectedRoute component={LandingPage} exact path={"/"} />
            <ProtectedRoute component={BattlePage} exact path={"/battle/:id"} />
          </Switch>
        </Router>
      </BattleControlProvider>
    </UserControlProvider>
  </StrictMode>
);

ReactDOM.render(<App />, document.getElementById("root"));
