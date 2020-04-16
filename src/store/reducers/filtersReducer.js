import {
    FILTERS_CHANGE_AGE,
    FILTERS_CHANGE_CITYNAME,
    FILTERS_CHANGE_PLACE,
    FILTERS_CHANGE_SEX
} from "../actions/actionTypes";

const initialState = {
    place: null,
    age: {
        from: 14,
        to: 85,
    },
    sex: 0,
}

export default function filterReducer(state = initialState, action) {
    switch (action.type) {
        case FILTERS_CHANGE_PLACE:
            return {
                ...state,
                place: { ...action.payload },
            };
        case FILTERS_CHANGE_SEX:
            return {
                ...state,
                sex: action.payload
            };
        case FILTERS_CHANGE_AGE: {
            return {
                ...state,
                age: { ...action.payload }
            };
        }
        default:
            return state;
    }
}