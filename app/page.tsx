"use client";

import { GET_CONTACT_LIST, DELETE_CONTACT } from "./graphql/queries";
import Table from "./components/Table";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import Spacer from "./components/Spacer";
import styled from "@emotion/styled";
import Icon from "./components/Icon";
import { COLORS, WEIGHTS } from "./constants";
import ContactForm from "./components/ContactForm";
import { useState } from "react";
import columns, { Contact } from "./contactColumnDefs";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const { data }: { data: { contact: Contact[] } } = useSuspenseQuery(
    GET_CONTACT_LIST,
    { fetchPolicy: "no-cache" }
  );

  return (
    <Wrapper className="screen-container">
      <Spacer size={56} />
      {showForm ? (
        <ContactForm action="Add" onCloseForm={() => setShowForm(false)} />
      ) : (
        <div>
          <HeadingWrapper>
            <h1>Contacts☎️</h1>
            <AddButton onClick={() => setShowForm(true)}>
              <Icon id="plus" size={16} />
              Add Contact
            </AddButton>
          </HeadingWrapper>
          <Spacer size={24} />
          <Table data={data.contact} columns={columns} />
        </div>
      )}

      <Spacer size={16} />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  min-height: 100vh;
`;

const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

const AddButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  background-color: ${COLORS.green[600]};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: ${WEIGHTS.medium};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 200ms ease;

  &:hover {
    background-color: ${COLORS.green[700]};
  }
`;
