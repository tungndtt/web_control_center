import SocketClient from "socket.io-client";
import axios from "axios";
import { datastore } from "../states";
import { serverConfig } from "../../package.json";

// dispatching actions with corresponding events
var actions = {
    "uhr_update": {type: "uhr", name: "update"},
    "booster_update": {type: "booster", name: "update"},
    "booster_try": {type: "booster", name: "try"},
    "booster_auto": {type: "booster", name: "auto"},
    "ortsbetrieb_place_update": {type: "ortsbetrieb", name: "place update"},
    "ortsbetrieb_durchschaltung_update": {type: "ortsbetrieb", name: "durchschaltung update"},
    "ortsbetrieb_other_update": {type: "ortsbetrieb", name: "other update"},
    "zn_update": {type: "zn", name: "update"},
    "block_felder_update": {type: "block", name: "felder update"},
    "block_relais1_update": {type: "block", name: "relais1 update"},
    "block_relais2_update": {type: "block", name: "relais2 update"},
    "telefone_update": {type: "telefone", name: "update"},
    "handregler_update": {type: "handregler", name: "update"},
    "rechner_boot_update": {type: "rechner", name: "boot update"},
    "rechner_screensaver_update": {type: "rechner", name: "screensaver update"},
    "rechner_system_update": {type: "rechner", name: "system update"},
    "rechner_project_update": {type: "rechner", name: "project update"},
    "znpi_desktop_update": {type: "znpi", name: "desktop update"},
    "znpi_volume_update": {type: "znpi", name: "volume update"},
    "znpi_project_update": {type: "znpi", name: "project update"},
    "znpi_notification_update": {type: "znpi", name: "notification update"}
};

var socket = undefined;

// setup the socket connection with server
export function initSocketConnection() {
    if(sessionStorage.token) {
        socket = SocketClient(
            `${serverConfig.protocol}://${serverConfig.host}:${serverConfig.socket_port}/`, 
            { rejectUnauthorized: false }
        );
        socket.on("connect", () => { 

            datastore.dispatch({type: "authenticated", value: true});

            console.log(`Connected to server ${serverConfig.host} on port ${serverConfig.socket_port}`);

            // load system states from the server
            socket.emit("load", {token: sessionStorage.token});
            socket.on("load", store => {
                for(let name in store) {
                    datastore.dispatch({
                        type: name,
                        name: "init",
                        value: store[name]
                    });
                }
            });

            // load control profiles
            socket.emit("load profiles", {token: sessionStorage.token});
            socket.on("profiles", profiles => {
                datastore.dispatch({type: "profiles", name: "init", value: profiles});
            });

            for(let name in actions) {
                // listen to the changes of system states (synchronization)
                // this is called when other client makes some changes in system states
                socket.on(name, (data) => {
                    datastore.dispatch({...actions[name], value: data});
                });
            }

            // the socket is disconnected with server when the token is no longer valid
            socket.on("disconnect", () => {
                console.log("Disconnected to the server");
                logout();
            });
        });
    }
}

// submit the action as request to server. 
// the action cannot be immediately executed but needs to wait if the action is able to execute
export function emitAction(name, value) {
    socket.emit(name, {token: sessionStorage.token, data: value});
}

// send the login request to server to fetch system states
export function sendLoginRequest(username, password) {
    axios({
        method: "POST",
        url: `${serverConfig.protocol}://${serverConfig.host}:${serverConfig.restapi_port}/login`,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            username: username,
            password: password
        }
    })
    .then(response => {
        if(response.data) {
            const {token, username, info} = response.data;
            // initialize the token & setup the socket connection
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("info", JSON.stringify(info));
            initSocketConnection();
        } else {
            alert("Invalid Authentication");
        }
    })
    .catch(err => {
        console.log(err);
    });
}

export function logout() {
    datastore.dispatch({type: "authenticated", value: false});
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("info");
    socket.disconnect();
}