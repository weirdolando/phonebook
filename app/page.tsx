"use client";

import { debounce } from "lodash";
import Spacer from "./components/Spacer";
import styled from "@emotion/styled";
import Icon from "./components/Icon";
import { COLORS, WEIGHTS } from "./constants";
import ContactForm from "./components/ContactForm";
import { useState, Suspense } from "react";
import { useContactFormContext } from "./context/ContactFormContext";
import SearchInput from "./components/SearchInput";
import ContactTable from "./ContactTable";
import Spinner from "./components/Spinner";

export default function Home() {
  const [filter, setFilter] = useState("");

  const { showForm, setShowForm, contactId, setContactId } =
    useContactFormContext();

  function handleAddContactClick() {
    setContactId(0);
    setShowForm(true);
  }

  const debouncedHandleChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value),
    500
  );

  return (
    <Wrapper className="screen-container">
      <main>
        {showForm ? (
          <ContactForm
            onCloseForm={() => setShowForm(false)}
            contactId={contactId}
          />
        ) : (
          <div>
            <Spacer size={56} />
            <HeadingWrapper>
              <h1>Contacts☎️</h1>
              <AddButton onClick={handleAddContactClick}>
                <Icon id="plus" size={16} />
                Add Contact
              </AddButton>
            </HeadingWrapper>
            <Spacer size={24} />
            <SearchInput
              placeholder="John Doe"
              onChange={debouncedHandleChange}
            />
            <Suspense
              fallback={
                <LoadingWrapper>
                  <Spinner />
                </LoadingWrapper>
              }
            >
              <ContactTable filter={filter} />
            </Suspense>
          </div>
        )}
      </main>
      <Spacer size={24} />
      <Footer>© GoTo 2023 — Lindhu Parang Kusuma</Footer>
      <Spacer size={4} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const Footer = styled.footer`
  font-size: 0.875rem;
  color: ${COLORS.gray[900]};
  text-align: center;
  margin-top: auto;
`;
