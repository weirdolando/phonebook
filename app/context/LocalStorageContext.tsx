"use client";

import { createContext, useContext, useState } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorage";
import type { Contact } from "../types";

type LocalStorageContextType = {
  favoriteContacts: Contact[];
  setFavoriteContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
};

const LocalStorageContext = createContext<LocalStorageContextType>({
  favoriteContacts: [],
  setFavoriteContacts: () => {},
});

export function LocalStorageContextProvider({
  children,
}: React.PropsWithChildren) {
  const [favoriteContacts, setFavoriteContacts] = useLocalStorageState(
    "phonebook-favorites",
    []
  );

  return (
    <LocalStorageContext.Provider
      value={{ favoriteContacts, setFavoriteContacts }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
}

export function useLocalStorageContext() {
  return useContext(LocalStorageContext);
}
