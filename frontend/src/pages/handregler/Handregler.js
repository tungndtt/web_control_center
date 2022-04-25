import React from "react";
import {useSelector} from "react-redux";
import StaticGrid from "../../reusable-components/StaticGrid";
import DropdownMenu from "../../reusable-components/DropdownMenu";
import {emitAction} from "../../repository";

const dataID = "handregler";

export default function Handregler() {
    return (
        <div style={{paddingTop: "50px"}} className="content-mid">
            <StaticGrid dataID={dataID} GridItem={<Item/>} numItemsOnRow={4} xspace={40} yspace={50} padding={10} border={false}/>
        </div>
    );
}

function Item({index}) {
    const {uid, name, options, properties} = useSelector(state => state[dataID])[index];

    function changeOption(value) {
        let changed = properties.controller !== Number(value);
        if (changed) {
            emitAction(dataID, {uid: uid, value: Number(value)});
        }
    }

    return (
        <div className="my-box-shadow my-item">
            <p className="my-header">{name}</p>
            <div className="my-dropdown">
                <DropdownMenu
                    options={options}
                    selected={properties.controller} callback={changeOption}
                />
            </div>
        </div>
    )
}