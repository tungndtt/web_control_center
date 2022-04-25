import React from "react";
import {Button, Col, Row, Table} from "react-bootstrap";
import {BsCheck2Circle} from "react-icons/bs";
import {emitAction} from "../../repository";
import {useSelector} from "react-redux";
import DropdownMenu from "../../reusable-components/DropdownMenu";

const dataID = "rechner";

const style = {
    container: {margin: 20},
    cell: {textAlign: 'center', verticalAlign: 'middle', fontSize: 16, fontWeight: 600, color: '#7c7979', padding: 10},
    cellContent: {display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
    dropdown: {fontSize: '15px', height: 'fit-content', width: 'fit-content'},
    button: {width: 100},
    groupSymbol: {textAlign: 'center', verticalAlign: 'middle'},
    groupHeader: {width: "100%", display: "flex", "flexDirection": "column", "alignItems": "center"},
    groupHeaderContent: {width: "100%", display: "flex", "flexDirection": "row", "justifyContent": "space-between"}
}

export default function Rechner(){
    let content = useSelector(state => state[dataID]);

    const getBtn = (list, type, btnStyle) => {
        let value = 0, variant = "", text = "", operation = "";
        switch(type) {
            case "on": {
                value = 2;
                variant = "success";
                text = "Ein";
                operation = "screensaver";
                break;
            }
            case "off": {
                value = 1;
                variant = "danger";
                text = "Aus";
                operation = "screensaver";
                break;
            }
            case "boot": {
                value = 42;
                variant = "primary";
                text = "Booten";
                operation = "boot";
                break;
            }
            default:
                break;
        }
        return <Button variant={variant} style={btnStyle? btnStyle : style.button}
            onClick={() => emitAction(dataID, {uid_list: list, operation: operation, value: value})}
        > {text} </Button>;
    };

    function action(list){
        return <div className='action'>
            {getBtn(list, "on")}
            {getBtn(list, "off")}
            {getBtn(list, "boot")}
        </div>
    }

    return Object.keys(content).length !== 0? (
        <div style={style.container}>
            <Table striped bordered hover size="xs">
                <thead style={{backgroundColor: '#f8f9fc'}}>
                    <tr>
                        <th className='header' rowSpan={2}>Name </th>
                        <th className='header' rowSpan={2}>Aktion </th>
                        <th className='header' rowSpan={2}>Bildschirmschoner </th>
                        <th className='header' rowSpan={2}>Projekt</th>
                        <th className='header' colSpan={content.groups.length}>
                            <Row>
                                <Col sm={5} style={{textAlign: 'right', paddingTop: '12px'}}>Alle</Col>
                                <Col sm={7} style={{textAlign: 'left'}}>
                                    {action(content.computers.map(computer => computer.uid))}
                                </Col>
                            </Row>
                        </th>
                    </tr>
                    <tr>
                        {content.groups.map((group, index) => (
                            <th className='header' key={index}>
                                <Row style={{display: 'inline-block', margin: 0}}>{group.name}</Row>
                                <Row>
                                    <div style={style.groupHeader}>
                                        <div style={style.groupHeaderContent}>
                                            {getBtn(group.list, "on", {width: 80, marginLeft: 0})}
                                            {getBtn(group.list, "off", {width: 80, marginRight: 0})}
                                        </div>
                                        {getBtn(group.list, "boot", {width: "100%"})}
                                    </div>
                                </Row>

                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {content.computers.map((computer,index) => (
                    <tr key={index}>
                        <td style={style.cell}>{computer.name}</td>
                        <td style={style.cell}>
                            <div style={style.cellContent}>
                                <DropdownMenu
                                    options={computer.os.map((os, index) => ({name: os, value: index}))}
                                    selected={computer.properties.system}
                                    callback={value => emitAction(dataID, {uid_list: [computer.uid], operation: "system", value: Number(value)})}
                                    style={style.dropdown}
                                />
                                {getBtn([computer.uid], "boot")}
                            </div>
                        </td>
                        <td style={style.cell}>
                            <div style={style.cellContent}>
                                {getBtn([computer.uid], "on")}
                                {getBtn([computer.uid], "off")}
                            </div>
                        </td>
                        <td style={style.cell}>
                            <DropdownMenu
                                options={content.projects}
                                selected={computer.properties.project-1}
                                callback={(e) => emitAction(dataID, {'uid_list': [computer.uid], 'operation': 'project', 'value': Number(e)+1})}
                                style={style.dropdown}
                            />
                        </td>
                        {content.groups.map((group, index) => (
                            <td style={style.groupSymbol} key={index}>
                                {group.list.includes(computer.uid) ? <BsCheck2Circle size={23}/> : ''}
                            </td>
                        ))
                        }
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    ) : null;
}