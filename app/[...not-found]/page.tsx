"use client";

import styled from "@emotion/styled";
import NotFound from "../components/NotFound";
import Link from "next/link";
import { COLORS, WEIGHTS } from "../constants";
import Spacer from "../components/Spacer";

export default function NotFoundPage() {
  return (
    <Wrapper>
      <NotFound
        title="Seems like you've hit a brick wall"
        message="The page you're looking for doesn't exist"
      >
        <Spacer size={12} />
        <LinkButton href="/">Take me home</LinkButton>
        <Spacer size={12} />
      </NotFound>
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

const LinkButton = styled(Link)`
  background-color: ${COLORS.green[600]};
  color: #fff;
  font-weight: ${WEIGHTS.medium};
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 200ms ease;

  &:hover {
    background-color: ${COLORS.green[700]};
  }
`;
