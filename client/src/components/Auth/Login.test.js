import React from "react";
import { render, fireEvent, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import Login from "./Login";
import { ContextProvider, ContextConsumer } from "../../context";
afterAll(cleanup);
describe("renders", () => {
  describe("if there is a state passed", () => {
    const state = {
      state: {
        currentUser: null
      }
    };
    test("renders without error if currentUser state is not undefined", () => {
      const { getByText } = render(
        <ContextProvider value={{ ...state }}>
          <ContextConsumer>
            {({ state, dispatch }) => <Login />}
          </ContextConsumer>
        </ContextProvider>
      );
      const component = getByText("Login with Google");
      expect(component).toHaveTextContent("Login with Google");
    });
  });
  describe("if there is no state passed", () => {
    const state = {};
    test("renders without error if currentUser state is undefined", () => {
      const { getByText } = render(
        <ContextProvider value={state}>
          <ContextConsumer>
            {({ state, dispatch }) => <Login />}
          </ContextConsumer>
        </ContextProvider>
      );
      const component = getByText("Login with Google");
      expect(component).toHaveTextContent("Login with Google");
    });
  });
});

describe("actions", () => {});
