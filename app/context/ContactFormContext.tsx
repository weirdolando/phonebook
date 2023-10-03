"use client";

import React, { createContext, useState, useContext } from "react";

type ContactFormContextType = {
  showForm: boolean;
  contactId?: number;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setContactId: React.Dispatch<React.SetStateAction<number>>;
};

const ContactFormContext = createContext<ContactFormContextType>({
  showForm: false,
  contactId: 0,
  setShowForm: () => {},
  setContactId: () => {},
});

export function ContactFormContextProvider({
  children,
}: React.PropsWithChildren) {
  const [showForm, setShowForm] = useState(false);
  const [contactId, setContactId] = useState(0);

  return (
    <ContactFormContext.Provider
      value={{ showForm, setShowForm, contactId, setContactId }}
    >
      {children}
    </ContactFormContext.Provider>
  );
}

export function useContactFormContext() {
  return useContext(ContactFormContext);
}
