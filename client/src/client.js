import { useState, useEffect } from "react";
import { createHttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import Auth0Lock from "auth0-lock";
export const BASE_URL =
  process.env === "production"
    ? "http://http://178.128.81.155:4000/graphql"
    : "http://localhost:4000/graphql";
export const useClient = () => {
  const [id_token, setIdToken] = useState("");
  useEffect(() => {
    const id_token = sessionStorage.getItem("accessToken");
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
export const useAuth = (onSuccess = () => {}) => {
  var lock = new Auth0Lock(
    "AEFH4AMjrk6gYYT0573yq70feyskkeRe",
    "bonmercado.auth0.com",
    {
      auth: {
        redirect: false,
        sso: true
      }
    }
  );
  useEffect(() => {
    lock.on("authenticated", function(authResult) {
      lock.getUserInfo(authResult.accessToken, function(error, profile) {
        if (error) {
          return;
        }
        sessionStorage.setItem("accessToken", authResult.accessToken);
        onSuccess();
      });
    });
  }, []);
  useEffect(() => {
    lock.checkSession(
      { accessToken: sessionStorage.getItem("accessToken") },
      function(err, authResult) {
        if (authResult) {
          lock.getUserInfo(authResult.accessToken, function(error, profile) {
            if (error) {
              return;
            }
            sessionStorage.setItem("accessToken", authResult.accessToken);
            onSuccess();
          });
        }
      }
    );
  }, []);
  return lock;
};
