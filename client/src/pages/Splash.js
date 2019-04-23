import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import Login from "../components/Auth/Login";
import Context from "../context";
const Splash = props => {
  const { state } = useContext(Context);
  const content = state.isAuth ? <Redirect to="/" /> : <Login />;
  return <div>{content}</div>;
};

export default Splash;
