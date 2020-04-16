import {ONLINE_UPDATE} from "../actions/actionTypes";

const initialState = {
    online: true,
}

export default function onlineReducer(state = initialState, action) {
    switch (action.type) {
        case ONLINE_UPDATE:
            return {
                ...state,
                online: action.payload,
            }
        default:
            return state;
    }
}
