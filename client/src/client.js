import { useState, useEffect } from "react";
import { createHttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import {} from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
export const BASE_URL =
  process.env === "production"
    ? "<production-url>"
    : "http://localhost:4000/graphql";
export const useClient = () => {
  const [id_token, setIdToken] = useState("");
  useEffect(() => {
    const id_token = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;
    setIdToken(id_token);
  }, []);
  const link = createHttpLink({
    uri: BASE_URL,
    headers: {
      authorization: id_token
    }
  });
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  });
  return client;
};
