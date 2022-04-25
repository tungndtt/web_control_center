import React, {cloneElement} from "react";
import { useSelector } from "react-redux";

function StaticGrid({dataID, GridItem, numItemsOnRow, xspace, yspace, padding, border}) {
    const grid = useSelector(state => {
        let items = state[dataID], gridItems = [], index=0;
        while(index < items.length) {
            let col = 0, row = [];
            while(col++ < numItemsOnRow && index < items.length) {
                row.push(items[index++]);
            }
            gridItems.push(row);
        }
        return gridItems;
    });

    return <div style={{
        display: "table",
        padding: padding,
        border: `1px ${border? "solid" : "transparent"} rgba(0, 0, 0, 0.2)`,
        borderRadius: '10px',
    }}>
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
        }}>
            {grid.map((row, rowIndex) => {
                return <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: yspace/2,
                    marginBottom: yspace/2,
                }} key={`row ${rowIndex}`}>
                    {row.map((_, colIndex) => 
                        <div style={{
                            paddingLeft: xspace/2, 
                            paddingRight: xspace/2
                        }} key={colIndex}>
                            {cloneElement(GridItem, { index: rowIndex*numItemsOnRow+colIndex })}
                        </div>
                    )}
                </div>
            })}
        </div>
    </div>
}

export default StaticGrid;