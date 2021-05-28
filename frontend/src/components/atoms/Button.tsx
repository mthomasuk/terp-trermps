import { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  onClick: () => void;
  variant?: "small" | "large";
}

const StyledButton = styled.button<Props>`
  cursor: pointer;
  background-color: gold;
  border: 0;
  border-radius: 5px;
  box-shadow: 3px 3px #000;
  font-size: ${({ variant }) => (variant === "large" ? "1.25rem" : "0.8rem")};
  padding: 0.5rem 1rem;
  transition: all 0.15s ease-in-out;

  &:hover {
    box-shadow: 1px 1px #000;
    transform: translate(2px, 2px);
  }
`;

const Button = ({ children, onClick, variant = "large" }: Props) => (
  <StyledButton onClick={onClick} variant={variant}>
    {children}
  </StyledButton>
);

export default Button;
