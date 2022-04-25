export default function profileReducer(state=[], action) {
    if(action.type === "profiles") {
        switch(action.name) {
            case "init": {
                state = action.value;
                break;
            }
            default: 
                break;
        }
    }
    return state;
}