import { ReactElement } from "react";

import styled from "styled-components";

import { SocketMessage } from "../../../../types";
import { ROUND_START } from "../../constants";

interface Props {
  message: SocketMessage;
}

const ListItem = styled.li`
  list-style: none;
`;

const Message = ({ message }: Props): ReactElement => {
  if (message.type === ROUND_START) {
    return <ListItem>Round {message.id} has started!</ListItem>;
  }

  return <ListItem>{message.body}</ListItem>;
};

export default Message;
