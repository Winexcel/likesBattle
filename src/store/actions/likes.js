import CodoAPI from "../../services/CodoAPI/CodoAPI";
import { pluralize } from "../../services/OverAllFunctions/OverAllFunctions";
import {
    LIKES_CLEAR_USERSLILST,
    LIKES_UPDATE_USERSLILST_INDICATOR_TOGGLE, LIKES_UPDATE_USERSLILST_SEX,
    LIKES_UPDATE_USERSLIST,
} from "./actionTypes";

export function likesUpdateUsersList() {
    return (dispatch, getState) => {
        const state = getState().likes;

        if (state.updateUsersListIndicator) return;

        dispatch(likesUpdateUsersListIndicatorToggle(true));

        CodoAPI.backend.user.getUsersLikes(state.usersList.count, state.usersList.offset, state.sex).then(data => {
            let usersList = { ...state.usersList };

            data.response.forEach((user) => {
                    let obj = {};
                    if (user.vote_identificator) {
                        obj.voteIdentificator = user.vote_identificator;
                        obj.firstName = user.first_name;
                        obj.sex = user.sex;
                        obj.photo = user.photo;
                        obj.info = user.time;
                        obj.user1Photo = user.user1_photo;
                        obj.user1PhotoBig = user.user1_photo_big;
                        obj.user2Photo = user.user2_photo;
                        obj.user2PhotoBig = user.user2_photo_big;
                    }
                    if (user.like_identificator) {
                        obj.likeIdentificator = user.like_identificator;
                        obj.firstName = user.first_name;
                        obj.sex = user.sex;
                        obj.photo = user.photo;
                        obj.info = user.time;
                        obj.likedPhoto = user.liked_photo;
                        obj.likedPhotoBig = user.liked_photo_big;
                    }

                    if (user.id) obj.id = user.id;

                    usersList.users.push(obj)
                }
            );

            if (data.response.length > 0)
                usersList.offset = usersList.offset + usersList.count;

            dispatch({
                type: LIKES_UPDATE_USERSLIST,
                payload: usersList,
            });

            dispatch(likesUpdateUsersListIndicatorToggle(false));
        })
    }
}

export function likesClearUsersList() {
    return {
        type: LIKES_CLEAR_USERSLILST,
    }
}

export function likesUpdateUsersListIndicatorToggle(toggle) {
    return {
        type: LIKES_UPDATE_USERSLILST_INDICATOR_TOGGLE,
        payload: toggle,
    }
}

export function likesUpdateUsersListSex(sex) {
    return {
        type: LIKES_UPDATE_USERSLILST_SEX,
        payload: sex,
    }
}


