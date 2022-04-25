export default function boosterReducer(state= {}, action) {
    if(action.type === "booster") {
        switch(action.name) {
            case "init": {
                state = action.value;
                break;
            }
            case "update": {
                let [uid_list, status] = action.value;
                if(!Array.isArray(uid_list)) uid_list = [uid_list];
                let places = state.places.map(place => {
                    return (uid_list.includes(place.uid)) ? {...place, properties: {...place.properties, status}} : place;
                })
                state = {...state, places};
                break;
            }
            case "try": {
                let [uid_list, numberOfTries] = action.value;
                if(!Array.isArray(uid_list)) uid_list = [uid_list];
                let places = state.places.map(place => {
                    return (uid_list.includes(place.uid)) ? {...place, properties: {...place.properties, try: numberOfTries}} : place;
                })
                state = {...state, places};
                break;
            }
            case "auto": {
                const auto = Array.isArray(action.value)? action.value[0] : action.value;
                state = {...state, auto};
                break;
            }
            default:
                break;
        }
    }
    return state;
};