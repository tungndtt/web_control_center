import React, {useState, useRef, useEffect} from "react";
import { emitAction } from "../../repository";
import { useSelector } from "react-redux";
import { Button, Row } from "react-bootstrap";
import './Uhr.css';

const time = {
    h: {min: 0, max: 23},
    m: {min: 0, max: 59},
    s: {min: 0, max: 59}
}

const dataID = "uhr";

export default function Uhr() {

    let [speedUp, setSpeedUp] = useState(0);
    const uhrState = useSelector(state => state[dataID]);
    let {currentTime, stop} = uhrState;
    let selectorRefs = useRef([]);
    let speedUpTimeout = useRef();

    useEffect(() => {
        const counter = !stop? setTimeout(() => emitAction(dataID, {operation: "time"}), 1000) : null;
        return () => clearTimeout(counter);
    });
    useEffect(() => {
        if(uhrState.startTime && !selectorRefs.current[0].value) {
            let start_time = [uhrState.startTime.getHours(), uhrState.startTime.getMinutes(), uhrState.startTime.getSeconds()];
            
            selectorRefs.current.forEach((selectorRef, index) => {
                selectorRef.value = start_time[index];
            });
        }
        setSpeedUp(Math.min(uhrState.speedUp, 59));
    }, [uhrState]);

    function displayTime() {
        if(currentTime) {
            let hour = currentTime.getHours();
            hour = hour < 10? "0"+hour : hour;
            let minute = currentTime.getMinutes();
            minute = minute < 10? "0"+minute : minute;
            let second = currentTime.getSeconds();
            second = second < 10? "0"+second : second;
            return `${hour} : ${minute} : ${second}`; 
        } else return "00 : 00 : 00";
    }

    function setTime() {
        let start_time = 0;
        [3600, 60, 1].forEach((second, i) => {
            start_time += second * selectorRefs.current[i].value;
        });
        const now = new Date();
        emitAction(dataID, {operation: "start_time", value: now.getTime() - now.getTime()%86400000 + start_time * 1000 - 3600000});
    }

    function changeSpeedUp(speedup) {
        setSpeedUp(speedup);
        clearTimeout(speedUpTimeout.current);
        speedUpTimeout.current = setTimeout(() => {
            emitAction(dataID, {operation: "speed_up", value: speedup});
        }, 1000);
    }

    return <div className="body" style={{textAlign: "center", verticalAlign: "middle", paddingTop: '150px'}}>
        <Row>
            <div className="d-flex justify-content-center" style={{flexDirection: 'row', display: 'flex', textAlign: 'center'}}>
                {Object.entries(time).map(([_, v], index) =>
                    <input
                        key={index} className="time-spinner-input"
                        ref={ref => selectorRefs.current[index] = ref}
                        type="number" min={v.min} max={v.max}
                    />
                )}
                <Button variant="success" className="set-time-btn" onClick={() => setTime()}>
                    Setzen
                </Button>
                <Button variant="warning" className="set-time-btn" onClick={() => emitAction(dataID, {operation: "reset"})}>
                    Aktuell
                </Button>
            </div>
        </Row>
        <Row>
            <div className="speedup-container">
                Speed up: {speedUp}
                <input className="slider" type="range" min={-59} max={59} value={speedUp || 0}
                    onChange={e => changeSpeedUp(Number(e.target.value))}
                />
            </div>
        </Row>
        <Row>
            <div style={{verticalAlign: "middle", paddingTop: '50px'}}>
                <div style={{
                        color: stop? "#d14d4d" : "#daf6ff", 
                        textShadow: stop? "0 0 20px rgb(231 31 59), 0 0 20px rgb(10 175 230 / 0%)" : "0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0)"
                    }} id="clock"
                >
                    <p className="time">{displayTime()}</p>
                </div>
                <button
                    style={{
                        background: !stop? "red" : "#198754",
                        width: 100,
                        height: 100,
                        fontWeight: 800,
                        color: "white",
                        borderRadius: 100,
                        border: "transparent"
                    }}
                    onClick={() => emitAction(dataID, {operation: "stop", value: !stop})}
                >
                    {stop? "START" : "STOP"}
                </button>
            </div>
        </Row>
    </div>;
}


