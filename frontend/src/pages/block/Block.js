import React from "react";
import { useSelector } from "react-redux";
import { emitAction } from "../../repository";
import './Block.css'
const style = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
    },
    item: {
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        marginBottom: "15px",
        width: "100%",
    },
    content: {
        display: "flex",
        justifyContent: "flex-start",
        padding: "10px",
        fontWeight: "bold",
    },
    optionContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start" 
    },
    body: {
        backgroundSize: '100%',
        height: '100%',
        paddingBottom: '20px',
    }
}

const dataID = "block";

export default function Block({match}){
    const content = useSelector(state => {
        const blockIndex = Number(match.params.id);
        return state[dataID][blockIndex]? state[dataID][blockIndex] : {"places": []};
    });

    return <div style={style.body}>
        <div className="block-container">
            {content.places.map((place, k) => {
                return <div className="Row my-box-shadow" key={k}>
                    <div style={style.content}>{place.name}</div>
                    <div style={style.content}>
                        {place.controllers.map((controller, i) => {
                            return <div style={style.optionContainer} key={i}>
                                {controller.options.map((option, j) => {
                                    return <button 
                                        className="btn btn-primary" key={j} 
                                        style={{background: option.color, borderColor: option.color}}
                                        onClick={() => emitAction(dataID, {uid: controller.uid, value: option.value})}
                                    >
                                        {option.name}
                                    </button>
                                })}
                            </div>;
                        })}
                    </div>
                </div>
            })}
        </div>
    </div>;
}