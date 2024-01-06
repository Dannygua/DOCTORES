import { AUTH_ACTIONS } from "./authActions";

export interface IAuthState {
    user: any;
    isLogin: boolean
}

export const authInitialState = {
  user: {},
  isLogin: false
};

export function authReducer(state:IAuthState, action:any) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      return { ...state, isLogin: true, user: action.payload };
    case AUTH_ACTIONS.LOGOUT:
      return { ...state, isLogin: false };
    default:
      return state
  }
  
}