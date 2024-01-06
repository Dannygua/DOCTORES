import { CALL_ACTIONS } from "./callActions";

export interface ICallState {
    call: any;
    isActive: boolean;
    isFull: boolean;
}

export const callInitialState = {
  call: null,
  isActive: false,
  isFull: true
};

export function callReducer(state:ICallState, action:any) {
  switch (action.type) {
    case CALL_ACTIONS.JOIN:
      return { ...state, isActive: true, call: action.payload };
    case CALL_ACTIONS.LEAVE:
      return { ...state, isActive: false, call: null };
    case CALL_ACTIONS.TOGGLE_SIZE:
        return { ...state, isFull: action.payload };     
    default:
      return state
  }
}