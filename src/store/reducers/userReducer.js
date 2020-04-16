import {
    USER_UPDATE_BATTLESCOUNT,
    USER_UPDATE_FIRSTNAME, USER_UPDATE_NOTIFICATIONSENABLED,
    USER_UPDATE_OWNLIKES,
    USER_UPDATE_PHOTO_100, USER_UPDATE_SEX,
    USER_UPDATE_USERSLIKES
} from "../actions/actionTypes";

const initialState = {
    firstName: '',
    ownLikes: 0,
    usersLikes: 0,
    photo100: null,
    sex: 0,
    battlesCount: 0,
    notificationEnabled: false,
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case USER_UPDATE_FIRSTNAME:
            return {
                ...state,
                firstName: action.payload,
            }
        case USER_UPDATE_BATTLESCOUNT:
            return {
                ...state,
                battlesCount: action.payload,
            }
        case USER_UPDATE_NOTIFICATIONSENABLED:
            return {
                ...state,
                notificationEnabled: action.payload,
            }
        case USER_UPDATE_OWNLIKES:
            return {
                ...state,
                ownLikes: action.payload,
            }
        case USER_UPDATE_USERSLIKES:
            return {
                ...state,
                usersLikes: action.payload,
            }
        case USER_UPDATE_PHOTO_100:
            return {
                ...state,
                photo100: action.payload,
            }
        case USER_UPDATE_SEX:
            return {
                ...state,
                sex: action.payload,
            }
        default:
            return state;
    }
}
