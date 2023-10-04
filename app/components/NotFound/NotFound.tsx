"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import NotFoundImg from "@/app/assets/search-not-found-small.png";
import { COLORS } from "@/app/constants";
import { ReactNode } from "react";

interface Props {
  title: string;
  message: string;
  children?: ReactNode;
}

export default function NotFound({ title, message, children }: Props) {
  return (
    <Wrapper>
      <Image
        src={NotFoundImg}
        width={200}
        alt="Tokopedia character with magnifying glass"
      />
      <TextWrapper>
        <Title>{title}</Title>
        <Message>{message}</Message>
        {children}
      </TextWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 500px) {
    gap: 20px;
    flex-direction: row;
  }
`;

const Title = styled.h2`
  color: ${COLORS.green[600]};
`;

const Message = styled.p`
  color: ${COLORS.gray[400]};
`;

const TextWrapper = styled.div`
  text-align: center;
  @media (min-width: 500px) {
    text-align: left;
    border-left: 1px solid ${COLORS.gray[400]};
    padding-left: 20px;
  }
`;
