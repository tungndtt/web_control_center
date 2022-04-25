import React from "react";
import {Button, Form} from "react-bootstrap";
import {useSelector} from "react-redux";
import {emitAction} from "../../repository";
import "./ortsbetrieb-ESTW.css";

const dataID = "ortsbetrieb";

export default function OrtsbetriebESTW() {

    const {places, macros, durchschaltung, others} = useSelector(state => state[dataID]);

    return places && macros && durchschaltung && others ? (
        <div className="ortsbetrieb-ESTW-container">
            <div className="control-container">
                <p className="control-header">Anlagen</p>
                {places.map((place, index) => {
                    return <div key={index} className="control my-box-shadow">
                        <p>{place.name}</p>
                        <div className="control-option">
                            <Form.Group>
                                {place.options.map((option, index) => (
                                        <Form.Check key={index} type={"radio"} label={option} inline
                                            checked={place.properties["technique"] === index}
                                            onChange={() => {
                                                const uid_map = {};
                                                uid_map[place.uid] = index;
                                                if (place.properties["technique"] !== index) {
                                                    emitAction(dataID, {target: "places", uid_map: uid_map});
                                                }
                                            }}
                                        />
                                    )
                                )}
                            </Form.Group>
                        </div>

                    </div>;
                })}
                <div className="button-group">
                    <Button className="btn btn-warning"
                        onClick={() => emitAction(dataID, {target: "places", uid_map: macros[0].map})}
                    >
                        Alle auf Alttechnik
                    </Button>
                    <Button className="btn btn-success"
                        onClick={() => emitAction(dataID, {target: "places", uid_map: macros[1].map})}
                    >
                        All auf ESTW
                    </Button>
                </div>

                </div>
            <div>
                <div className="control-container">
                    <p className="control-header">Durchschaltung</p>
                    <div className="control my-box-shadow">
                        <p>{durchschaltung.name}</p>
                        <div className="control-option">
                            <Form.Group>
                                {durchschaltung.options.map((option, index) => (
                                        <Form.Check key={index} type={'radio'} label={option} inline
                                            checked={durchschaltung.properties["status"] === index}
                                            onChange={() => {
                                                if (durchschaltung.properties["status"] !== index) {
                                                    emitAction(dataID, {target: "buchsbaum", operation: "select", value: index});
                                                }  
                                            }}
                                        />
                                    )
                                )}
                            </Form.Group>
                        </div>
                    </div>
                    <Button className="btn btn-danger" disabled={durchschaltung.properties["status"] === 0}
                            onClick={() => {
                                emitAction(dataID, {target: "buchsbaum", operation: "signal"})
                            }}
                    >
                        Signale auf Fahrt
                    </Button>
                </div>
                <div className="control-container">
                    <p className="control-header">Weitere Einstellungen</p>
                    {others.map((other, index) => {
                        return <div key={index} className="control my-box-shadow">
                            <p>{other.name}</p>
                            <div className="control-option">
                                <Form.Group>
                                    {other.options.map((option, index) => (
                                            <Form.Check key={index} type={'radio'} label={option} inline
                                                checked={other.properties["option"] === index}
                                                onChange={() => {
                                                    if (other.properties["option"] !== index) {
                                                        emitAction(dataID, {target: "others", uid: other.uid, value: index});
                                                    } 
                                                }}
                                            />
                                        )
                                    )}
                                </Form.Group>
                            </div>
                        </div>;
                    })}
                </div>
            </div>
        </div>
    ) : null;
}