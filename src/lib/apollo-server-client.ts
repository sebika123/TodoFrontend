import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

export const createServerClient = () => {
  return new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri:
        process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3002/graphql",
      fetch: (uri, options) =>
        fetch(uri, {
          ...options,
          cache: "no-store", // or next: { revalidate: 10 }
        }),
    }),
    cache: new InMemoryCache(),
  });
};

const serverClient = createServerClient();
export default serverClient;
