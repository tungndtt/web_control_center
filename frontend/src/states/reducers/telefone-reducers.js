export default function telefoneReducer(state=[], action) {
    if(action.type === "telefone") {
        switch(action.name) {
            case "init": {
                state = action.value;
                break;
            }
            case "update": {
                let [uid, value] = action.value;
                if(Array.isArray(uid)) uid = uid[0];
                state = state.map(element => {
                    return (element.uid === uid)?  {...element, properties: {number: value}} : element;
                });
                break;
            }
            default:
                break;
        }
    }
    return state;
};