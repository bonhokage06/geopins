import { useState, useEffect } from "react";
import { GraphQLClient } from "graphql-request";
export const BASE_URL =
  process.env === "production"
    ? "<production-url>"
    : "http://localhost:4000/graphql";
export const useClient = () => {
  const [url, setUrl] = useState("");
  const [id_token, setIdToken] = useState("");
  useEffect(() => {
    const id_token = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;
    setIdToken(id_token);
  }, []);
  return new GraphQLClient(BASE_URL, {
    headers: {
      authorization: id_token
    }
  });
};
