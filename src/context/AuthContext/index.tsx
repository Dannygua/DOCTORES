import React, { useReducer } from "react";
import { AUTH_ACTIONS } from "./authActions";
import { authInitialState, authReducer } from "./authReducer";

export const AuthContext = React.createContext({
  user: {},
  isLogin: false,
  login: (user:any) => {},
  logout: () => {}
});

export const AuthProvider = ({ children }:any):any => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const value:any = {
    user: state.user,
    isLogin: state.isLogin,
    login: (user:any) => {
      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: user });
    },
  
    logout: () => {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
    

  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
