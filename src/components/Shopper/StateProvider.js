import React, { createContext, useContext, useReducer } from "react";
//prepare the data layer
export const StateContext = createContext();

//Wrap our app and provide the Data Layer
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

//pull the info from the data layer
export const useStateValue = () => useContext(StateContext);
