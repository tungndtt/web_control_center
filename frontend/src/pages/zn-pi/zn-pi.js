import React, {useState, useRef, useEffect} from "react";
import DropdownMenu from "../../reusable-components/DropdownMenu";
import {useSelector} from "react-redux";
import {emitAction} from "../../repository";
import "./zn-pi.css";

const dataID = "znpi";

function notificationCheck(place, notification_index) {
    const binary = place.properties.notification.toString(2);
    return binary.charAt(binary.length-1-notification_index) === "1";
} 

export default function ZnPi() {
    //State
    let znpis = useSelector(state => state[dataID]);
    const [volumes, setVolumes] = useState([]);
    useEffect(() => {
        setVolumes(znpis.places?.map(place => Math.max(place.properties.volume-1, 0)));
    }, [znpis]);
    let timeouts = useRef([]);

    function changeVolume(index, value) {
        setVolumes(volumes.map((volume, i) => i===index? value : volume));
        clearTimeout(timeouts.current[index]);
        timeouts.current[index] = setTimeout(() => {
            emitAction(dataID, {uid: znpis.places[index].uid, operation: "volume", value: Number(value)+1});
        }, 1000);
    }

    return znpis.places && volumes? (
        <div className="znpi-container">
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Desktop</th>
                    <th>Project</th>
                    <th>Volume</th>
                    <th>Nachrichten</th>
                </tr>
                </thead>

                <tbody>
                {
                    znpis.places.map((place, index) => {
                        return (
                            <tr key={index}>
                                <td>{place.name}</td>
                                <td>
                                    <div className="my-dropdown">
                                        <DropdownMenu selected={place.properties.desktop}
                                            options={znpis.desktops?.map((desktop, i) => ({value: i, name: desktop}))} 
                                            callback={value => emitAction(dataID, {uid: place.uid, operation: "desktop", value: Number(value)})}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="my-dropdown">
                                        <DropdownMenu options={znpis.projects} selected={place.properties.project-1}
                                            callback={value => emitAction(dataID, {uid: place.uid, operation: "znproject", value: Number(value)+1})}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <label>
                                        <div>{volumes[index]}</div>
                                        <input type="range" min={znpis.volume[0]} max={znpis.volume[1]}
                                            value={volumes[index] || 0}
                                            className="slider"
                                            onChange={e => changeVolume(index, e.target.value)}
                                        />
                                    </label>

                                </td>
                                <td><div className="notification-container">
                                    {
                                        znpis.notifications.map((notification, notification_index) => {
                                            const name = `znpi-notification-${place.uid}`;
                                            return (
                                                <label key={notification_index}>
                                                    <input type="checkbox" value={notification_index} name={name}
                                                        checked={notificationCheck(place, notification_index)}
                                                        onChange={e => {
                                                            const mask = Math.pow(2, Number(e.target.value));
                                                            const value = e.target.checked? place.properties.notification + mask : place.properties.notification - mask;
                                                            emitAction(dataID, {uid: place.uid, operation: "notification", value: value})
                                                        }}
                                                    />
                                                    {notification}
                                                </label>
                                            )
                                        })
                                    }
                                </div></td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    ) : null;
}