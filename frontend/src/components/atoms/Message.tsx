import { ReactElement } from "react";

import styled from "styled-components";

import { ROUND_START } from "../../constants";

interface Props {
  message: any;
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
