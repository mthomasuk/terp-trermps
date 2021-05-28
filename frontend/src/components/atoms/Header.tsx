import { useContext } from "react";
import styled from "styled-components";

import { UserControlContext } from "../context/UserControlStore";

import Button from "./Button";

const Heading = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.75rem;
`;

const UserDetails = styled.div`
  font-size: 1.1rem;
`;

const Header = () => {
  const { getSignedInUser, signOutUser } = useContext(UserControlContext);

  const currentUser = getSignedInUser();

  return currentUser ? (
    <Heading>
      <UserDetails>
        Logged in as: <strong>{currentUser.name}</strong>
      </UserDetails>
      <Button onClick={signOutUser} variant="small">
        Log out
      </Button>
    </Heading>
  ) : null;
};

export default Header;
