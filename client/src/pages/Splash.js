import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import Login from "../components/Auth/Login";
import Context from "../context";
const Splash = () => {
  const { state } = useContext(Context);
  return <div>{state.isAuth ? <Redirect to="/" /> : <Login />}</div>;
};

export default Splash;
