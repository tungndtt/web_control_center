export default function handreglerReducer(state=[], action) {
    if(action.type === "handregler") {
        switch(action.name) {
            case "init": {
                state = action.value;
                break;
            }
            case "update": {
                let [uid, value] = action.value;
                if(Array.isArray(uid)) uid = uid[0];
                state = state.map(element => {
                    return element.uid === uid? {...element, properties: {controller: value}} : element;
                });
                break;
            }
            default:
                break;
        }
    } 
    return state;
};