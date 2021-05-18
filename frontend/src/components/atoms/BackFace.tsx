import styled from "styled-components";

const Face = styled.div`
  border-radius: 7px;
  background-color: #fff;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const BackFace = styled(Face)`
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #e1e1e1 25%, transparent 25%) -50px 0,
    linear-gradient(225deg, #e1e1e1 25%, transparent 25%) -50px 0,
    linear-gradient(315deg, #e1e1e1 25%, transparent 25%),
    linear-gradient(45deg, #e1e1e1 25%, transparent 25%);
  background-color: #cfd8dc;
  background-size: 100px 100px;
  border-radius: 4px;
`;

export default BackFace;
