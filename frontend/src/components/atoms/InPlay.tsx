import styled from "styled-components";

export const Play = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #333;
  border-radius: 4px;
  margin: 0 1rem;
  height: 324px;
  width: 210px;
  display: flex;
  position: relative;

  @media only screen and (max-width: 768px) {
    & {
      margin: 1rem 0;
    }
  }
`;

const InPlay = styled(Play)`
  &:before {
    position: absolute;
    content: "✋";
    font-size: 1.15rem;
    top: -2rem;
  }

  &:after {
    position: absolute;
    color: #acacac;
    content: "Click to move card into hand";
    font-size: 1.15rem;
    text-transform: uppercase;

    @media only screen and (max-width: 768px) {
      & {
        content: "Press to move card into hand";
      }
    }
  }
`;

export default InPlay;
