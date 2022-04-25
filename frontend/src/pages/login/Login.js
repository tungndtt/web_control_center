import React from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { sendLoginRequest } from "../../repository";
import { Redirect } from "react-router-dom";
import './Login.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function Login(){
    const authenticated = useSelector(state => state["authenticated"]);

    const usernameRef = useRef(""), passwordRef = useRef("");

    function submitLoginInfo() {
        const username = usernameRef.current.value, password = passwordRef.current.value;
        if(username !== "" && password !== "") {
            sendLoginRequest(username, password);
        } else {
            alert("Authentication info is not fully provided");
        }
    }

    return !authenticated ? <div className="login">
        <div className="login-box">
        <h2>Login</h2>
        <div className="form">
            <div className="user-box">
                <input type="text" name="" required="" ref={usernameRef}/>
                    <label>Username</label>
            </div>
            <div className="user-box">
                <input type="password" name="" required="" ref={passwordRef}/>
                    <label>Password</label>
            </div>
            <a href="#/" onClick={submitLoginInfo}>
                <span />
                <span />
                <span />
                <span />
                Submit
            </a>
        </div>
        </div>
    </div> : <Redirect to={{pathname: sessionStorage.endpoint? sessionStorage.endpoint : "/uhr"}}/>;
}