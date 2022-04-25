export default function blockReducer(state={}, action) {
    if(action.type === "block") {
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
};