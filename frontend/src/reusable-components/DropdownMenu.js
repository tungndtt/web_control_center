import React from 'react';
import {FormSelect} from "react-bootstrap";

function DropdownMenu({options, selected, callback, style}) {
    return <FormSelect  style={ style? {...style, fontSize: '15px', maxHeight: '40px'} : {fontSize: '15px', maxHeight: '35px'}} 
        value={selected} onChange={e => callback(e.target.value)}
    >
        {
            options.map((option, index) =>
                <option value={option.value} key={index}>
                    {option.name}
                </option>
            )
        }
    </FormSelect>
}

export default DropdownMenu;