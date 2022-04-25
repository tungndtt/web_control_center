export default function ortsbetriebReducers(state={}, action) {
    if (action.type === "ortsbetrieb") {
        switch (action.name) {
            case "init": {
                state = action.value;
                break;
            }
            case "place update": {
                let [uid_list, technique] = action.value;
                if(!Array.isArray(uid_list)) uid_list = [uid_list];
                state = {...state, 
                    places: state.places.map(place => {
                        if(uid_list.includes(place.uid)) return {...place, properties: {technique}};
                        else return place;
                    })
                };
                break;
            }
            case "other update": {
                let [uid, option] = action.value;
                if(Array.isArray(uid)) uid = uid[0];
                state = {...state, 
                    others: state.others.map(other => {
                        if(other.uid === uid) return {...other, properties: {option}};
                        else return other;
                    })
                };
                break;
            }
            case "durchschaltung update": {
                let status = action.value[1];
                state = {...state, durchschaltung: {...state.durchschaltung, properties: {status: status}}};
                break;
            }
            default:
                break;
        }
    }
    return state;
}