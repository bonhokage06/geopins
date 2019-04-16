import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import Context from "./context";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { state } = useContext(Context);
  return (
    <Route
      render={props =>
        !state.isAuth ? <Redirect to="/Login" /> : <Component {...props} />
      }
      {...rest}
    />
  );
}
