import {
    TOP_CLEAR_USERSLILST,
    TOP_UPDATE_USERSLILST_INDICATOR_TOGGLE,
    TOP_UPDATE_USERSLILST_SEX,
    TOP_UPDATE_USERSLIST
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

export default function topReducer(state = initialState, action) {
    switch (action.type) {
        case TOP_UPDATE_USERSLIST:
            return {
                ...state,
                usersList: { ...action.payload },
            }
        case TOP_UPDATE_USERSLILST_SEX:
            return {
                ...state,
                sex: action.payload,
            }
        case TOP_CLEAR_USERSLILST:
            return {
                usersList: {
                    count: 15,
                    offset: 0,
                    users: [],
                },
                sex: 0,
                updateUsersListIndicator: false
            }
        case
        TOP_UPDATE_USERSLILST_INDICATOR_TOGGLE:
            return {
                ...state,
                updateUsersListIndicator: action.payload,
            }
        default:
            return state;
    }
}