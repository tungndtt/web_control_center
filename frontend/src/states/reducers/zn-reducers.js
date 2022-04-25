export default function znReducers(state=[], action) {
    if (action.type === "zn") {
        switch (action.name) {
            case "init": {
                state = action.value;
                break;
            }
            case "update": {
                let [uid_list, status] = action.value;
                if(!Array.isArray(uid_list)) uid_list = [uid_list];
                state = state.map(e => (uid_list.includes(e.uid)? {...e, properties: {status}} : e));
                break;
            }
            default:
                break;
        }
    }
    return state;
}