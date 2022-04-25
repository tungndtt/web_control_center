import React, {cloneElement, useRef, useState} from "react";
import { useSelector } from "react-redux";
import {
  GridContextProvider,
  GridDropZone,
  GridItem
} from "react-grid-dnd";
import { emitAction } from "../repository";


const padding = 20, elementPadding = 30;

function Grid({dataID, gridsOnRow, itemComponent}) {
    
    const items = useSelector(state => {
        return state[dataID];
    });

    const itemRef = useRef([]), size = useRef([0, 0]);
    const [height, setHeight] = useState(1), [width, setWidth] = useState(1);

    setTimeout(() => {
        if(itemRef.current && itemRef.current.length === items.length) {
            let mh = 0, mw = 0;
            itemRef.current.forEach(r => {
                mh = mh < r.clientHeight ? r.clientHeight : mh;
                mw = mw < r.clientWidth ? r.clientWidth : mw;
            });
            if(size.current[0] !== mw || size.current[1] !== mh) {
                size.current[0] = mw;
                size.current[1] = mh;
                let newHeight = Math.floor((mh + elementPadding) * Math.ceil(items.length/gridsOnRow));
                let newWidth = Math.floor(mw * gridsOnRow * 1.3) + padding*2;
                setWidth(newWidth);
                setHeight(newHeight);
            }
        }
    }, 0);

    function onChange(_0, sourceIndex, targetIndex, _1) {
        // prevent to drag element from a grid to other grid
        if(!_1) {
            emitAction(`${dataID}-swap`, {src: sourceIndex, dst: targetIndex});
        }
    }

    return (
        <GridContextProvider onChange={onChange}>
            <GridDropZone
                    id="GRID"
                    style={{
                        "display": "flex",
                        "border": "2px solid rgba(0, 0, 0, 0.2)",
                        "borderRadius": "1rem",
                        "height": `${height}px`,
                        "width": `${width}px`,
                        "padding": `${padding}px`,
                    }}
                    boxesPerRow={gridsOnRow}
                    rowHeight={size.current[1] + elementPadding}
                >
                    {items.map(
                        (item, index) => (
                            <GridItem style={{display: "inline-table"}} key={item.id}>
                                {cloneElement(
                                    itemComponent, 
                                    {
                                        ref: childRef => itemRef.current[index] = childRef, 
                                        item: item, 
                                        dataID: dataID,
                                        index: index
                                    }
                                ) }
                            </GridItem>
                        )
                    )}
                </GridDropZone>
        </GridContextProvider>
    );
}

export default Grid;