"use client";

/*
  Use this client for Client Components
*/

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
  NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr";

let apolloClient: NextSSRApolloClient<NormalizedCacheObject>;

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URI,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

export function initializeApollo() {
  const _apolloClient = apolloClient ?? makeClient();
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={initializeApollo}>
      {children}
    </ApolloNextAppProvider>
  );
}
