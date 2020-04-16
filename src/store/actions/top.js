import {
    TOP_CLEAR_USERSLILST,
    TOP_UPDATE_USERSLILST_INDICATOR_TOGGLE,
    TOP_UPDATE_USERSLILST_SEX,
    TOP_UPDATE_USERSLIST
} from "./actionTypes";
import CodoAPI from "../../services/CodoAPI/CodoAPI";
import { pluralize } from "../../services/OverAllFunctions/OverAllFunctions";

export function topUpdateUsersList() {
    return (dispatch, getState) => {
        const state = getState().top;

        if (state.updateUsersListIndicator) return;

        dispatch(topUpdateUsersListIndicatorToggle(true));

        CodoAPI.backend.top.getUsers(state.usersList.count, state.usersList.offset, state.sex).then(data => {
            let usersList = { ...state.usersList };

            data.response.forEach(user => {
                    let obj = {
                        firstName: user.first_name,
                        photo: user.photo,
                        info: user.weekly_users_likes + ' ' + pluralize(user.weekly_users_likes, ['лайк', 'лайка', 'лайков']),
                    };

                    if (user.id) obj.id = user.id;
                    if (user.vote_identificator) obj.voteIdentificator = user.vote_identificator;

                    usersList.users.push(obj)
                }
            );

            if (data.response.length > 0)
                usersList.offset = usersList.offset + usersList.count;

            dispatch({
                type: TOP_UPDATE_USERSLIST,
                payload: usersList,
            });

            dispatch(topUpdateUsersListIndicatorToggle(false));
        })
    }
}
export function topClearUsersList() {
    return {
        type: TOP_CLEAR_USERSLILST,
    }
}

export function topUpdateUsersListIndicatorToggle(toggle) {
    return {
        type: TOP_UPDATE_USERSLILST_INDICATOR_TOGGLE,
        payload: toggle,
    }
}

export function topUpdateUsersListSex(sex) {
    return {
        type: TOP_UPDATE_USERSLILST_SEX,
        payload: sex,
    }
}