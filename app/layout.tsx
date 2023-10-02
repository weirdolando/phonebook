import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GlobalStyles from "./components/GlobalStyles";
import { ApolloWrapper } from "@/lib/apollo-wrapper";

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
        <ApolloWrapper>{children}</ApolloWrapper>
        <GlobalStyles />
      </body>
    </html>
  );
}
