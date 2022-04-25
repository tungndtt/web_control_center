import { combineReducers } from "redux";
import uhrReducer from "./uhr-reducers";
import boosterReducer from "./booster-reducers";
import ortsbetriebReducers from "./ortsbetrieb-reducers";
import znReducers from "./zn-reducers";
import telefoneReducer from "./telefone-reducers";
import blockReducer from "./block-reducers";
import handreglerReducer from "./handregler-reducers";
import rechnerReducer from "./rechner-reducers";
import znpiReducers from "./znpi-reducers";
import profileReducer from "./profile-reducers";

// authenticated reducer
function authenticatedReducer(state=false, action){
    if(action.type === "authenticated") {
        state = action.value;
    } 
    return state;
}

export const reducers = combineReducers({
    "uhr": uhrReducer,
    "booster": boosterReducer,
    "ortsbetrieb" : ortsbetriebReducers,
    "zn": znReducers,
    "telefone": telefoneReducer,
    "block": blockReducer,
    "handregler": handreglerReducer,
    "rechner": rechnerReducer,
    "znpi": znpiReducers,
    "authenticated": authenticatedReducer,
    "profiles": profileReducer
});
