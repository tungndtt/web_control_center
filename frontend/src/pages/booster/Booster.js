import React from 'react';
import {Table, Button, Row, Col} from "react-bootstrap";
import {useSelector} from "react-redux";
import {emitAction} from "../../repository";
import {BsCheck2Circle} from 'react-icons/bs';
import './Booster.css';
import "bootstrap";

const dataID = "booster";

const style = {
    autoContainer: {display: "flex", flexDirection: "row", justifyContent: "center", padding: "5px 0", fontSize: "bold"},
    status: {borderRadius: '50%', height: '25px', width: '25px', display: 'inline-block'},
    button: { width: '100px'},
    cell: {textAlign: 'center', verticalAlign: 'middle', fontSize: 16, fontWeight: 600, color: '#7c7979', padding: 10}
}

export default function Booster(){
    let content = useSelector(state => state[dataID]);

    const on = <div style={{...style.status, backgroundColor: '#198754'}}/>
    const off = <div style={{...style.status, backgroundColor: '#dc3545'}}/>
    const versuch = number => {
        return <div style={{...style.status, backgroundColor: '#fbfa06', textAlign: 'center', verticalAlign: 'middle'}}>
            {number}
        </div>
    };

    function action(list){
        return <div className='action'>
            <Button style={style.button} variant="success" 
                onClick={() => emitAction(dataID, {uid_list: list, value: 1, operation: "technique"})}
            >Ein</Button>

            <Button style={style.button} variant="danger" 
                onClick={() => emitAction(dataID, {uid_list: list, value: 2, operation: "technique"})}
            >Aus</Button>
        </div>
    }

    return Object.keys(content).length !== 0? (
       <div className="booster-container">
           <Table striped bordered hover size="xs">
               <thead style={{backgroundColor: '#f8f9fc'}}>
                    <tr>
                        <th colSpan={3+content.groups.length} className='header' style={{background: '#bdbaba'}}>
                            <div style={style.autoContainer}>
                                Boosteraustomatik
                                {['aus', 'ein'].map((action, index) => (
                                    <label key={index} style={{textAlign: "center", margin: "0 25px"}}>
                                        <input type="radio" checked={content.auto === index}
                                            style={{marginRight: 8}}
                                            onChange={_ => {
                                                emitAction(dataID, {uid_list: [], operation: "auto", value: index});
                                            }}
                                        />
                                        {action}
                                    </label>
                                ))}
                            </div>
                        </th>
                    </tr>
                   <tr>
                       <th className='header' rowSpan={2}>Name </th>
                       <th className='header' rowSpan={2}>Actions</th>
                       <th className='header' rowSpan={2}>Status</th>
                       <th className='header' colSpan={content.groups.length}>
                           <Row>
                               <Col sm={5} style={{textAlign: 'right', paddingTop: '12px'}} >Alle</Col>
                               <Col sm={7} style={{textAlign: 'left'}}>
                                   {action(content.places.map(place => place.uid))}
                                </Col>
                           </Row>
                       </th>
                   </tr>
                   <tr>
                       {content.groups.map((group, index) => 
                           <th className='header' key={index}>
                               <Row style={{display: 'inline-block', margin: 0}}>{group.name}</Row>
                               <Row>{action(group.list)}</Row>
                           </th>
                        )}
                   </tr>
               </thead>
               <tbody>
               {content.places.map((place,index) => (
                   <tr key={index}>
                       <td style={style.cell}>{place.name}</td>
                       <td style={style.cell}>
                           {action([place.uid])}
                       </td>
                       <td style={style.cell}>
                           {(place.properties.status & 1) ? on : (place.properties.try === 0 ? off : versuch(place.properties.try))}
                       </td>
                       {
                            content.groups.map((group, index) => 
                                <td style={style.cell} key={index}>
                                    {group.list.includes(place.uid) ? <BsCheck2Circle size={23}/> : null}
                                </td>
                            )
                       }
                   </tr>
               ))}
               </tbody>
           </Table>
       </div>
    ) : null;
}
