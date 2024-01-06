import React, { createContext, useReducer } from 'react'
import { ActionsInitialState, ActionsReducer } from './ActionsReducer'
import { ACTION_TYPES } from './ActionTypes';

export const ActionsContext:any = createContext(0)

export const ActionsProvider = ({ children }: any):any => {
    const [{items, refresh}, dispatch] = useReducer(ActionsReducer, ActionsInitialState)

    const value:any = {
        items,
        refresh, 
        setAction: (items:any) => {
            dispatch({type: ACTION_TYPES.SET_ITEMS, payload: {items} })
        },
        createAction: (item:any) =>{
            dispatch({type: ACTION_TYPES.CREATE_ITEM, payload: {item}});
        },
        updateAction: (itemId:any, updatedItem:any) =>{
            dispatch({type: ACTION_TYPES.UPDATE_ITEM, payload: {itemId,updatedItem}});
        },
        deleteAction: (itemId:any) =>{
            dispatch({type: ACTION_TYPES.DELETE_ITEM, payload: {itemId}});
        },
      };
    return <ActionsContext.Provider value={value}>{children}</ActionsContext.Provider>;
};
