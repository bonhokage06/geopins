import { createContext } from "react";

const Context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins:[]
});
export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;
export default Context;
