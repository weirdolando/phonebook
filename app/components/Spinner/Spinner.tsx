import { COLORS } from "@/app/constants";
import styled from "@emotion/styled";

export default function Spinner() {
  return <Circle role="status"></Circle>;
}

const Circle = styled.div`
  width: 32px;
  height: 32px;
  display: inline-block;
  border-radius: 50%;
  border: 4px solid ${COLORS.gray[300]};
  border-right-color: ${COLORS.green[600]};
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
