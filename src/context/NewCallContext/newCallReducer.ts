import { NEW_CALL_ACTIONS } from "./newCallActions";


export interface ICallState {
  humanClient: any,
  screenClient: any,
  localAudioTrack: any,
  localVideoTrack: any,
  localScreenTrack: any,
  joinSuccess: boolean
  openDrawer: boolean
}

export const callInitialState = {
  humanClient: null,
  screenClient: null,
  localAudioTrack: null,
  localVideoTrack: null,
  localScreenTrack: null,
  joinSuccess: false,
  openDrawer: false
};


export function callReducer(state:ICallState, action:any) {
  switch (action.type) {
    case NEW_CALL_ACTIONS.JOIN_HUMAN:
      const newState = { ...state, humanClient: action.payload.humanClient, localAudioTrack: action.payload.localAudioTrack, localVideoTrack: action.payload.localVideoTrack, joinSuccess: true, openDrawer: true  };
      console.log('newState', newState)
      return newState
      
    case NEW_CALL_ACTIONS.LEAVE_HUMAN:
      return { ...state, humanClient: null, localAudioTrack: null, localVideoTrack: null, joinSuccess: false, openDrawer: false};
    
      
    case NEW_CALL_ACTIONS.JOIN_SCREEN:
      return { ...state, screenClient: action.payload.screenClient, localScreenTrack: action.payload.localScreenTrack };
    
    case NEW_CALL_ACTIONS.LEAVE_SCREEN:
      return { ...state, screenClient: null, localScreenTrack: null };

    
    case NEW_CALL_ACTIONS.HIDE_DRAWER:
      return {...state, openDrawer: false }
    
    case NEW_CALL_ACTIONS.SHOW_DRAWER: 
      return {...state, openDrawer: true }  

    default:
      return state
  }
}