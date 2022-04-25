export default function uhrReducer(state={}, action) {
    if(action.type === "uhr") {
        let value = undefined;
        switch(action.name) {
            case "init": {
                value = action.value;
                break;
            }
            case "update": {
                value = Array.isArray(action.value)? action.value[0] : action.value;
                break;
            }
            default:
                break;
        }
        state = {...value, currentTime: new Date(value.currentTime), startTime: new Date(value.startTime)};
    } 
    return state;
};