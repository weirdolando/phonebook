import styled from "@emotion/styled";
import { initializeApollo } from "@/lib/apollo-wrapper";
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

export type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  phones: { number: string }[];
};

// Extend CSSProperties interface since I want to use custom properties
declare module "react" {
  interface CSSProperties {
    "--color"?: string;
  }
}

const apolloClient = initializeApollo();

async function handleDeleteContact(id: number) {
  try {
    await apolloClient.mutate({
      mutation: DELETE_CONTACT,
      variables: { id },
    });

    successAlertWithMessage("Contact deleted");
    apolloClient.refetchQueries({
      include: [GET_CONTACT_LIST],
    });
  } catch (err) {
    errorAlert();
  }
}

const columnHelper = createColumnHelper<Contact>();
const columns = [
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
  columnHelper.accessor("id", {
    cell: (props) => {
      const id = props.getValue();
      return (
        <IconWrapper>
          <IconButton
            style={{ "--color": COLORS.rose[400] }}
            title="Add to favorites"
          >
            <VisuallyHidden>Add contact to favorites</VisuallyHidden>
            <Icon id="heart" size={20} />
          </IconButton>
          <IconButton
            style={{ "--color": COLORS.blue[600] }}
            title="Edit contact"
          >
            <VisuallyHidden>Edit contact</VisuallyHidden>
            <Icon id="edit" size={20} />
          </IconButton>
          <IconButton
            style={{ "--color": COLORS.red[600] }}
            title="Delete contact"
            onClick={() => {
              confirmationAlertWithArgument(handleDeleteContact, id);
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

export default columns;
