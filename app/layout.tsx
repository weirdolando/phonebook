import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GlobalStyles from "./components/GlobalStyles";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { LocalStorageContextProvider } from "./context/localStorageContext";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Phonebook — Lindhu Parang Kusuma",
  description: "Phonebook Tokopedia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <LocalStorageContextProvider>{children}</LocalStorageContextProvider>
        </ApolloWrapper>
        <GlobalStyles />
      </body>
    </html>
  );
}
