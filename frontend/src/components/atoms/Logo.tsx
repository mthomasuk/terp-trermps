import styled from "styled-components";

const Retro = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 230px;

  h1,
  h3,
  h5 {
    margin: 0;
    text-align: center;
    text-transform: uppercase;
  }

  h1,
  h3 {
    color: #d72b2b;
    font-size: 30px;
    font-style: italic;
    font-weight: 600;
    text-shadow: 2px 0px #fff, 4px 0px #000;
  }

  h1 {
    font-size: 80px;
    margin: -10px 0;
  }

  h3 {
    letter-spacing: 0.5rem;
  }

  h5 {
    color: white;
    font-size: 22px;
    letter-spacing: 1.5rem;
    text-shadow: 2px 2px #000;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: #000;
  }

  &:after {
    content: "TM";
    font-size: 0.65rem;
    position: absolute;
    bottom: 0.35rem;
    right: -5px;
  }
`;

const Logo = () => (
  <Retro>
    <h5>Super</h5>
    <h1>Terp</h1>
    <h3>Trermps</h3>
  </Retro>
);

export default Logo;
