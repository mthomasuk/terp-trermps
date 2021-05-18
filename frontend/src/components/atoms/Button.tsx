import styled from "styled-components";

const Button = styled.button`
  cursor: pointer;
  background-color: gold;
  border: 0;
  border-radius: 5px;
  box-shadow: 3px 3px #000;
  font-size: 1.25rem;
  padding: 0.5rem 1rem;
  transition: all 0.15s ease-in-out;

  &:hover {
    box-shadow: 1px 1px #000;
    transform: translate(2px, 2px);
  }
`;

export default Button;
