import {
    LIKES_UPDATE_USERSLILST_INDICATOR_TOGGLE, LIKES_UPDATE_USERSLILST_SEX,
    LIKES_UPDATE_USERSLIST, LIKES_CLEAR_USERSLILST
} from "../actions/actionTypes";

const initialState = {
    usersList: {
        count: 15,
        offset: 0,
        users: [],
    },
    sex: 0,
    updateUsersListIndicator: false,
}

export default function likesReducer(state = initialState, action) {
    switch (action.type) {
        case LIKES_UPDATE_USERSLIST:
            return {
                ...state,
                usersList: { ...action.payload },
            }
        case LIKES_UPDATE_USERSLILST_SEX:
            return {
                ...state,
                sex: action.payload,
            }
        case LIKES_CLEAR_USERSLILST:
            return {
                usersList: {
                    count: 15,
                    offset: 0,
                    users: [],
                },
                sex: 0,
                updateUsersListIndicator: false
            }
        case LIKES_UPDATE_USERSLILST_INDICATOR_TOGGLE:
            return {
                ...state,
                updateUsersListIndicator : action.payload,
            }
        default:
            return state;
    }
}