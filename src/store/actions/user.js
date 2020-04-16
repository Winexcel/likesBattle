import {
    USER_UPDATE_BATTLESCOUNT,
    USER_UPDATE_FIRSTNAME, USER_UPDATE_NOTIFICATIONSENABLED,
    USER_UPDATE_OWNLIKES,
    USER_UPDATE_PHOTO_100, USER_UPDATE_SEX,
    USER_UPDATE_USERSLIKES
} from "./actionTypes";

export function userUpdateFirstName(firstName) {
    return {
        type: USER_UPDATE_FIRSTNAME,
        payload: firstName,
    }
}

export function userUpdateOwnLikes(ownLikes) {
    return {
        type: USER_UPDATE_OWNLIKES,
        payload: ownLikes,
    }
}

export function userUpdateUsersLikes(usersLikes) {
    return {
        type: USER_UPDATE_USERSLIKES,
        payload: usersLikes,
    }
}

export function userUpdateBattlesCount(battlesCount) {
    return {
        type: USER_UPDATE_BATTLESCOUNT,
        payload: battlesCount,
    }
}

export function userUpdateNotificationsEnabled(notificationsEnabled) {
    return {
        type: USER_UPDATE_NOTIFICATIONSENABLED,
        payload: notificationsEnabled,
    }
}

export function userUpdatePhoto100(link) {
    return {
        type: USER_UPDATE_PHOTO_100,
        payload: link,
    }
}

export function userUpdateSex(sex) {
    return {
        type: USER_UPDATE_SEX,
        payload: sex,
    }
}
