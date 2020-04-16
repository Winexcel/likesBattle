import {
    QUESTS_SET_GLOBAL_TIMER_ID,
    QUESTS_UPDATE_CURRENT_REWARD,
} from "./actionTypes";

export function questsSetGlobalTimer(currentReward, stepReward, maximumReward, delay) {
    return (dispatch, getState) => {
        let state = getState().quests;

        if(state.globalTimerId !== 0) return;

        dispatch(questsUpdateCurrentReward(currentReward));

        dispatch(questsSetGlobalTimerId(
            setInterval(() => {
                let state = getState().quests;
                if (state.parameters.currentReward >= maximumReward) {
                    dispatch(questsUnsetGlobalTimer);
                    return;
                }

                /* обновляем вознаграждение если есть интернет */
                if(getState().online.online === true) {
                    const newCurrentReward = +(state.parameters.currentReward + stepReward).toFixed(4);
                    dispatch(questsUpdateCurrentReward(newCurrentReward));
                }
            }, delay)
        ))

    }
}

export function questsUnsetGlobalTimer() {
    return (dispatch, getState) => {
        clearInterval(getState().quests.globalTimerId);
        dispatch(questsSetGlobalTimerId(0));
    }
}

export function questsUpdateCurrentReward(currentReward) {
    return {
        type: QUESTS_UPDATE_CURRENT_REWARD,
        payload: currentReward,
    }
}

export function questsSetGlobalTimerId(globalTimerId) {
    return {
        type: QUESTS_SET_GLOBAL_TIMER_ID,
        payload: globalTimerId,
    }
}
