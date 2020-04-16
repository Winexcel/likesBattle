import {ONLINE_UPDATE} from "./actionTypes";

export function updateOnline(online) {
    return {
        type: ONLINE_UPDATE,
        payload: online,
    }
}
