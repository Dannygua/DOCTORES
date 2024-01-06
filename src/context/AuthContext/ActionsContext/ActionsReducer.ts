import { ACTION_TYPES } from "./ActionTypes"; 


export const ActionsInitialState = {
    items: [],
    refresh: false
}

export const ActionsReducer = (state = ActionsInitialState, action: any) => {

    switch (action.type) {
        case ACTION_TYPES.SET_ITEMS: {
            
            return {...state, items: action.payload.items }
        }
        
        case ACTION_TYPES.CREATE_ITEM: {
            return {...state, items: [...state.items, action.payload.item]  }
        }

        case ACTION_TYPES.UPDATE_ITEM: {
            const itemIndex = state.items.findIndex((it) => it['_id'] === action.payload.itemId)
            if(itemIndex!==-1){
                let copy:any = [...state.items]
                copy[itemIndex] = action.payload.updatedItem
                return {...state, items: copy }
            }
            return state
        }

        case ACTION_TYPES.DELETE_ITEM: {
            return {...state, items: state.items.filter((it) => it['_id'] !== action.payload.itemId )}
        }
            
        default:
            return state
    }

}
