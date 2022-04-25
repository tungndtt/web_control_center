import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StaticGrid from "../../reusable-components/StaticGrid";
import DropdownMenu from "../../reusable-components/DropdownMenu";
import { Button } from "react-bootstrap";
import { emitAction } from "../../repository";

const style = {
    container: {paddingTop: "30px"},
    highlightBorder: {"border": "3px solid rgb(143 189 235 / 60%)"},
    customContainer: {
        "diplay": "flex", "flexDirection": "row", 
        "justifyContent": "space-between", 
        "borderTop": "4px solid rgb(199 199 199 / 50%)", 
        "margin": "0 10px", "padding": "10px 0"
    },
    customInput: {
        "height": 35, "width": 180, 
        "padding": 5, "borderRadius": 5,
        "border": "3px solid rgb(143 189 235 / 60%)"
    }
}

const dataID = "telefone";

export default function Telefone(){
    return (
        <div style={style.container} className="content-mid">
            <StaticGrid dataID={dataID} GridItem={<Item/>} numItemsOnRow={4} xspace={30} yspace={50} padding={10} border={false}/>
        </div>
    );
}

function Item({index}) {
    const state = useSelector(state => state[dataID]);
    let {uid, name, options, properties} = state[index];
    options = [{name: "Custom", value: 1}, ...options];
    const [useCustom, setUseCustom] = useState(false);
    const [input, setInput] = useState(1);

    useEffect(() => {
        setInput(state[index].properties.number);
        setUseCustom(state[index].options.findIndex(option => option.value === state[index].properties.number) < 0);
    }, [state, index]);

    function changeOption(value) {
        emitAction(dataID, {uid: uid, value: Number(value)}); 
        setUseCustom(Number(value) === 1);
        setInput(1);
    }

    function setCustomTelephone() {
        const value = Number(input);
        if(!isNaN(value)) {
            emitAction(dataID, {uid: uid, value});
        }
    }

    return (
        <div className="my-box-shadow my-item">
            <p className="my-header">{name}</p>
            <div className="my-dropdown">
                <DropdownMenu options={options} selected={properties.number} callback={changeOption}/>
            </div>
            <div style={!useCustom? {"display": "none"} : style.customContainer}>
                <input value={input} onChange={e => setInput(e.target.value)} 
                    style={style.customInput}
                />
                <Button onClick={setCustomTelephone}>Setzen</Button>
            </div>
        </div>
    )
}