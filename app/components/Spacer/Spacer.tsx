import styled from "@emotion/styled";

interface Args {
  axis?: "horizontal" | "vertical";
  size: number;
}

function getHeight({ axis, size }: Args) {
  return axis === "horizontal" ? 1 : size;
}
function getWidth({ axis, size }: Args) {
  return axis === "vertical" ? 1 : size;
}

const Spacer = styled.span<Args>`
  display: block;
  width: ${getWidth}px;
  min-width: ${getWidth}px;
  height: ${getHeight}px;
  min-height: ${getHeight}px;
`;

export default Spacer;
