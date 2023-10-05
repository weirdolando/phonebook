import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GlobalStyles from "./components/GlobalStyles";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { LocalStorageContextProvider } from "./context/LocalStorageContext";
import { ContactFormContextProvider } from "./context/ContactFormContext";
import EmotionRootStyleRegistry from "./emotion-root-style-registry";

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
        <EmotionRootStyleRegistry>
          <ApolloWrapper>
            <LocalStorageContextProvider>
              <ContactFormContextProvider>
                {children}
                <GlobalStyles />
              </ContactFormContextProvider>
            </LocalStorageContextProvider>
          </ApolloWrapper>
        </EmotionRootStyleRegistry>
      </body>
    </html>
  );
}
