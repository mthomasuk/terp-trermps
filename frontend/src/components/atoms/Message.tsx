import styled from "styled-components";

import { BATTLE_START } from "../../constants";

interface Props {
  message: SocketMessage;
}

const ListItem = styled.li`
  list-style: none;
`;

const Message = ({ message }: Props) => {
  if (message.type === BATTLE_START) {
    return <ListItem>Battle {message.id} has started!</ListItem>;
  }

  return <ListItem>{message.body}</ListItem>;
};

export default Message;
