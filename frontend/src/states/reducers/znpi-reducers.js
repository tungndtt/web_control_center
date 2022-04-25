function setProperty(uid, propertyValue, state, property) {
    const newState = {};
    Object.assign(newState, state);
    const place = newState.places.find(p => p.uid === uid);
    if(place){
        place.properties[property] = propertyValue;
    }
    return newState;
}

export default function znpiReducers(state={}, action) {
    if (action.type === "znpi") {
        switch (action.name) {
            case "init": {
                state = action.value;
                break;
            }
            case "desktop update": {
                const [uid, desktop] = action.value;
                if(desktop !== 0) {
                    state = setProperty(uid, desktop, state, "desktop");
                }
                break;
            }
            case "volume update": {
                const [uid, volume] = action.value;
                if(volume !== 0) {
                    state = setProperty(uid, volume, state, "volume");
                }
                break;
            }
            case "notification update": {
                const [uid, notification] = action.value;
                state = setProperty(uid, notification, state, "notification");
                break;
            }
            case "project update": {
                const [uid, project] = action.value;
                if(project !== 0) {
                    state = setProperty(uid, project, state, "project");
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    return state;
}