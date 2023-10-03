"use client";

import styled from "@emotion/styled";
import Spinner from "./components/Spinner";

export default function Loading() {
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
