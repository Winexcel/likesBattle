import {
    QUESTS_SET_GLOBAL_TIMER_ID,
    QUESTS_UPDATE_CURRENT_REWARD,
} from "../actions/actionTypes";

const initialState = {
    globalTimerId: 0,
    parameters: {
        currentReward: 0,
    }
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case QUESTS_UPDATE_CURRENT_REWARD:
            return {
                ...state,
                parameters: {
                    currentReward: action.payload,
                },
            }
        case QUESTS_SET_GLOBAL_TIMER_ID:
            return {
                ...state,
                globalTimerId: action.payload,
            }
        default:
            return state;
    }
}
