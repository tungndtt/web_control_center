export default function rechnerReducer(state= {}, action) {
    if(action.type === "rechner") {
        switch(action.name) {
            case "init": {
                state = action.value;
                break;
            }
            case "boot update": {
                let [uid_list, boot] = action.value;
                if(!Array.isArray(uid_list)) uid_list = [uid_list];
                let computers = state.computers.map(computer =>
                    (uid_list.includes(computer.uid)) ? {...computer, properties: {...computer.properties, boot}} : computer
                );
                state = {...state, computers: computers};
                break;
            }
            case "screensaver update": {
                let [uid_list, screensaver] = action.value;
                if(!Array.isArray(uid_list)) uid_list = [uid_list];
                let computers = state.computers.map(computer =>
                    (uid_list.includes(computer.uid)) ? {...computer, properties: {...computer.properties, screensaver}} : computer
                );
                state = {...state, computers: computers};
                break;
            }
            case "project update": {
                let [uid_list, project] = action.value;
                if(project !== 0) {
                    if(!Array.isArray(uid_list)) uid_list = [uid_list];
                    let computers = state.computers.map(computer =>
                        (uid_list.includes(computer.uid)) ? {...computer, properties: {...computer.properties, project}} : computer
                    );
                    state = {...state, computers: computers};
                }
                break;
            }
            case "system update": {
                let [uid_list, system] = action.value;
                if(!Array.isArray(uid_list)) uid_list = [uid_list];
                let computers = state.computers.map(computer =>
                    (uid_list.includes(computer.uid)) ? {...computer, properties: {...computer.properties, system}} : computer
                );
                state = {...state, computers: computers};
                break;
            }
            default:
                break;
        }
    }
    return state;
};