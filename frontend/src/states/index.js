import { createStore } from 'redux'
import { reducers } from './reducers';

const data = {
    "uhr": {},
    "ortsbetrieb" : {},
    "zn": [],
    "telefone": [],
    "handregler": [],
    "booster": {} ,
    "block": [],
    "rechner": {},
    "znpi": {},
    "authenticated": false,
    "profiles": []
};

export const datastore = createStore(reducers, data,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);