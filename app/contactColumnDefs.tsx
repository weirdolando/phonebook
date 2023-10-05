"use client";

import styled from "@emotion/styled";
import {
  confirmationAlertWithArgument,
  errorAlert,
  successAlertWithMessage,
} from "./helpers/alerts";
import { DELETE_CONTACT, GET_CONTACT_LIST } from "./graphql/queries";
import { createColumnHelper } from "@tanstack/react-table";
import { COLORS } from "./constants";
import VisuallyHidden from "./components/VisuallyHidden";
import Icon from "./components/Icon";
import { useMutation } from "@apollo/client";
import { useLocalStorageContext } from "./context/LocalStorageContext";
import { useContactFormContext } from "./context/ContactFormContext";
import type { Contact } from "./types";

// Extend CSSProperties interface since I want to use CSS custom properties
declare module "react" {
  interface CSSProperties {
    "--color"?: string;
  }
}

const columnHelper = createColumnHelper<Contact>();
export const columns = [
  columnHelper.accessor("first_name", {
    cell: (props) => props.getValue(),
    header: () => <span>First Name</span>,
  }),
  columnHelper.accessor("last_name", {
    cell: (props) => props.getValue(),
    header: () => <span>Last Name</span>,
  }),
  columnHelper.accessor("phones", {
    cell: (props) => (
      <UnorderedList>
        {props.getValue().map((phone, idx) => (
          <li key={idx}>{phone.number}</li>
        ))}
      </UnorderedList>
    ),
    header: () => <span>Phones</span>,
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => {
      const contact = props.row.original;
      const { favoriteContacts, setFavoriteContacts } =
        useLocalStorageContext();
      const { setShowForm, setContactId } = useContactFormContext();

      const [deleteContact, { data, loading, error }] = useMutation(
        DELETE_CONTACT,
        {
          onCompleted: () => {
            successAlertWithMessage("Contact deleted");
          },
          refetchQueries: [GET_CONTACT_LIST],
        }
      );

      function handleToggleFavorites(contact: Contact) {
        if (contact.isFavorite) {
          contact.isFavorite = false;
          const newFavoriteContacts = favoriteContacts.filter(
            (c) => c.id !== contact.id
          );
          return setFavoriteContacts(newFavoriteContacts);
        }
        contact.isFavorite = true;
        setFavoriteContacts([...favoriteContacts, contact]);
      }

      async function handleDeleteContact(id: number) {
        await deleteContact({ variables: { id } });
        const newFavoriteContacts = favoriteContacts.filter((c) => c.id !== id);
        setFavoriteContacts(newFavoriteContacts);
        successAlertWithMessage("Contact deleted");
      }

      function handleEditContact() {
        setShowForm(true);
        setContactId(contact.id);
      }

      if (error) {
        errorAlert();
      }

      return (
        <IconWrapper>
          <IconButton
            style={{ "--color": COLORS.rose[400] }}
            title="Add to favorites"
            onClick={() => handleToggleFavorites(contact)}
          >
            <VisuallyHidden>
              {contact.isFavorite ? "Remove" : "Add"} contact to favorites
            </VisuallyHidden>
            <Icon
              id="heart"
              size={20}
              color={contact.isFavorite ? COLORS.rose[400] : undefined}
              fill={contact.isFavorite ? COLORS.rose[400] : "transparent"}
            />
          </IconButton>
          <IconButton
            style={{ "--color": COLORS.blue[600] }}
            title="Edit contact"
            onClick={handleEditContact}
          >
            <VisuallyHidden>Edit contact</VisuallyHidden>
            <Icon id="edit" size={20} />
          </IconButton>
          <IconButton
            style={{ "--color": COLORS.red[600] }}
            title="Delete contact"
            onClick={() => {
              confirmationAlertWithArgument(handleDeleteContact, contact.id);
            }}
          >
            <VisuallyHidden>Delete contact</VisuallyHidden>
            <Icon id="trash" size={20} />
          </IconButton>
        </IconWrapper>
      );
    },
    header: () => (
      <VisuallyHidden>
        <span>Actions</span>
      </VisuallyHidden>
    ),
  }),
];

const UnorderedList = styled.ul`
  margin: 0;
  margin-left: 16px;
  padding: 0;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: end;
  padding-right: 12px;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 200ms ease;
  color: ${COLORS.gray[400]};

  &:hover {
    color: var(--color);
    transform: translateY(-2px);
  }
`;
