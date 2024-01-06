import React, { useReducer } from "react";
import { CALL_ACTIONS } from "./callActions";
import { callInitialState, callReducer } from "./callReducer";

export const CallContext = React.createContext({
  call: null,
  isActive: false, 
  join: (call:any) => {},
  leave: () => {},
  toggleSize: (isFull: boolean) => {},
  isFull: true
});

export const CallProvider = ({ children }:any):any => {
  const [state, dispatch] = useReducer(callReducer, callInitialState);
  const value:any = {
    call: state.call,
    isActive: state.isActive,
    isFull: state.isFull,
     
    join: (call:any) => {
      dispatch({ type: CALL_ACTIONS.JOIN, payload: call });
    },
  
    leave: () => {
      dispatch({ type: CALL_ACTIONS.LEAVE });
    },

    toggleSize: (isFull: boolean) => {
        dispatch({ type: CALL_ACTIONS.TOGGLE_SIZE, payload: isFull });
    }
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
