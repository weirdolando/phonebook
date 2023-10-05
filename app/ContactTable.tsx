"use client";

import { useState } from "react";
import Table from "./components/Table";
import { useQuery } from "@apollo/client";
import { columns } from "./contactColumnDefs";
import styled from "@emotion/styled";
import { GET_CONTACT_LIST, GET_CONTACT_LIST_COUNT } from "./graphql/queries";
import { useMemo } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useLocalStorageContext } from "./context/LocalStorageContext";
import NotFound from "./components/NotFound";
import Spacer from "./components/Spacer";

import type { Contact } from "./types";

const PAGINATION_LIMIT = 10;

export default function ContactTable({ filter }: { filter: string }) {
  const { data: dataContactListCount } = useQuery(GET_CONTACT_LIST_COUNT, {
    variables: {
      where: {
        _or: [
          { first_name: { _like: `%${filter}%` } },
          { last_name: { _like: `%${filter}%` } },
        ],
      },
    },
    fetchPolicy: "no-cache",
  });
  const contactListCount =
    dataContactListCount?.contact_aggregate?.aggregate?.count;

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGINATION_LIMIT,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize, contactListCount]
  );

  const pageCount =
    contactListCount > 0 ? Math.ceil(contactListCount / pageSize) : 1;

  const { data: dataContactList }: { data: { contact: Contact[] } } =
    useSuspenseQuery(GET_CONTACT_LIST, {
      variables: {
        offset: pageIndex * PAGINATION_LIMIT,
        limit: pagination.pageSize,
        where: {
          _or: [
            { first_name: { _like: `%${filter}%` } },
            { last_name: { _like: `%${filter}%` } },
          ],
        },
      },
      fetchPolicy: "no-cache",
    });

  const { favoriteContacts, setFavoriteContacts } = useLocalStorageContext();

  const filteredContacts = dataContactList.contact.filter(
    (contact) =>
      (favoriteContacts as Contact[]).findIndex((c) => c.id === contact.id) < 0
  );

  const allContacts = [...favoriteContacts, ...filteredContacts];

  if (!allContacts.length) {
    return (
      <NotFoundWrapper>
        <Spacer size={44} />
        <NotFound
          title="Oops, the contact you're looking for doesn't exist"
          message="Try using another keyword"
        />
      </NotFoundWrapper>
    );
  }

  return (
    <>
      <Table
        data={allContacts}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        pageCount={pageCount}
      />
    </>
  );
}

const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
