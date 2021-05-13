import { ReactElement } from "react";

import styled from "styled-components";

import { BATTLE_START } from "../../constants";

interface Props {
  message: any;
}

const ListItem = styled.li`
  list-style: none;
`;

const Message = ({ message }: Props): ReactElement => {
  if (message.type === BATTLE_START) {
    return <ListItem>Battle {message.id} has started!</ListItem>;
  }

  return <ListItem>{message.body}</ListItem>;
};

export default Message;
