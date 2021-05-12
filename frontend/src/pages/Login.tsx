import { useContext, useState, ChangeEvent, ReactElement } from "react";
import { useHistory, Redirect } from "react-router-dom";

import styled from "styled-components";

import { UserControlContext } from "../components/context/UserControlStore";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 500px;

  @media only screen and (max-width: 768px) {
    & {
      width: 80vw;
    }
  }
`;

const Label = styled.label`
  display: block;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  margin: 0.75rem 0;
  border: 1px dotted #333;
  border-radius: 5px;
  outline: none;
  padding: 0.75rem;
  font-size: 1rem;
`;

const Login = (): ReactElement => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { isSignedIn, signInUser } = useContext(UserControlContext);
  const { push } = useHistory();

  const updateName = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const updatePassword = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (name && password) {
      try {
        await signInUser(name, password);

        push("/");
      } catch (error) {
        console.warn(error);
      }
    } else {
      alert("Please provide a name and password");
    }
  };

  return isSignedIn ? (
    <Redirect to="/" />
  ) : (
    <>
      <Wrapper>
        <Form onSubmit={onSubmit}>
          <Label>
            PLZ ENTER YOUR NAME:
            <Input
              type="text"
              placeholder="Your name, plz"
              onChange={updateName}
            />
          </Label>
          <Label>
            PLZ ENTER A PASSWORD:
            <Input
              type="password"
              placeholder="A password, plz"
              onChange={updatePassword}
            />
          </Label>
          <button type="submit" onClick={onSubmit}>
            Login
          </button>
        </Form>
      </Wrapper>
    </>
  );
};

export default Login;
