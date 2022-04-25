import React from "react";
import {Button, Form} from "react-bootstrap";
import {useSelector} from "react-redux";
import {emitAction} from "../../repository";
import "./zn.css";

const dataID = "zn";

export default function Zn() {
    //State
    let zns = useSelector(state => state[dataID]);

    return (
        <div className="zn-container">
            <div className="zn-button-container">
                {zns.map((zn, index) => (
                    <div key={index} className="zn-button my-box-shadow">
                        <p className="my-header">{zn.name}</p>
                        <div className="zn-option">
                            <Form.Group>
                                {['eingeschaltes', 'ausgeschaltet'].map((action, index) => (
                                        <Form.Check key={index} type={'radio'} label={action} inline
                                            checked={zn.properties["status"] === index}
                                            onChange={() => {
                                                if (zn.properties["status"] !== index) {
                                                    emitAction(dataID, {uid_list: [zn.uid], value: index});
                                                }
                                            }}
                                        />
                                    )
                                )}
                            </Form.Group>
                        </div>
                    </div>
                ))}
            </div>
            <div className="zn-group-button content-mid">
                <Button style={{width: '200px', height: '50px', fontWeight: '700', fontSize: '20px'}}
                        className="btn btn-success"
                        onClick={() => emitAction(dataID, {uid_list: zns.map(zn => zn.uid), value: 0})}
                >
                    Alle auf eingeschaltet
                </Button>
                <Button style={{width: '200px', height: '50px', fontWeight: '700', fontSize: '20px'}}
                        className="btn btn-danger"
                        onClick={() => emitAction(dataID, {uid_list: zns.map(zn => zn.uid), value: 1})}
                >
                    All auf ausgeschaltet
                </Button>
            </div>
        </div>
    )
}