"use client"

import type React from "react"

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { SessionProvider, useSession } from "next-auth/react"
import { useMemo } from "react"

// Client component that creates Apollo client
function ApolloClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  // Create client with authentication
  const client = useMemo(() => {
    const httpLink = new HttpLink({
      uri: "/api/graphql",
    })

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: session ? `Bearer ${session?.user?.id}` : "",
        },
      }
    })

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    })
  }, [session])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

// Wrapper component that provides both session and Apollo client
export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApolloClientProvider>{children}</ApolloClientProvider>
    </SessionProvider>
  )
}

