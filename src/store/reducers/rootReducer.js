import { combineReducers } from "redux";
import battleReducer from "./battleReducer";
import filtersReducer from "./filtersReducer";
import topReducer from "./topReducer";
import likesReducer from "./likesReducer";
import userReducer from "./userReducer";
import questsReducer from "./questsReducer";
import onlineReducer from "./onlineReducer";

export default combineReducers({
    battle: battleReducer,
    filters: filtersReducer,
    top: topReducer,
    likes: likesReducer,
    user: userReducer,
    quests: questsReducer,
    online: onlineReducer,
})
