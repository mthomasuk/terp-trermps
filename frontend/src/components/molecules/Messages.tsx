import styled from "styled-components";

import Message from "../atoms/Message";

interface Props {
  messages: SocketMessage[];
}

const Bar = styled.div`
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #333;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.25rem;
  max-height: 15vh;
  overflow: scroll;

  @media only screen and (max-width: 768px) {
    & {
      font-size: 1rem;
    }
  }
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
`;

const Messages = ({ messages }: Props) => (
  <Bar>
    <List>
      {messages && messages.length ? (
        <Message message={messages[messages.length - 1]} />
      ) : null}
    </List>
  </Bar>
);

export default Messages;
