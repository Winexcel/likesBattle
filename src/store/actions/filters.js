import { FILTERS_CHANGE_AGE, FILTERS_CHANGE_CITYNAME, FILTERS_CHANGE_PLACE, FILTERS_CHANGE_SEX } from "./actionTypes";
import CodoAPI from "../../services/CodoAPI/CodoAPI";

var timerAge = null;

export function filtersChangeSex(sex) {
    return (dispatch, getState) => {
        const state = getState().filters;
        CodoAPI.backend.battle.setFilters({
            ...state,
            sex
        });

        dispatch({
            type: FILTERS_CHANGE_SEX,
            payload: sex,
        })
    }
}

export function filtersChangeAge(age) {
    return (dispatch, getState) => {
        const state = getState().filters;

        if(timerAge) {
            clearTimeout(timerAge);
            timerAge = null;
        }

        timerAge = setTimeout(() => {
            CodoAPI.backend.battle.setFilters(state, age);
            clearTimeout(timerAge);
        }, 100);

        dispatch({
            type: FILTERS_CHANGE_AGE,
            payload: age,
        })
    }
}

export function filtersChangePlace(place) {
    return (dispatch, getState) => {
        dispatch({
            type: FILTERS_CHANGE_PLACE,
            payload: place,
        })
    }
}