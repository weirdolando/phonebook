import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { GET_CONTACT_DETAIL } from "../queries";
import { skipToken, UseSuspenseQueryResult } from "@apollo/client";
import type { Contact } from "@/app/types";

interface ContactDetail {
  contact_by_pk: Contact;
}

export default function useContactDetail(contactId: number | undefined) {
  const { data }: UseSuspenseQueryResult<ContactDetail | undefined, any> =
    useSuspenseQuery(
      GET_CONTACT_DETAIL,
      contactId
        ? { variables: { id: contactId }, fetchPolicy: "no-cache" }
        : skipToken
    );

  return { data };
}
