import React from "react";
import {useSelector} from "react-redux";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import SideMenu from "./reusable-components/SideMenu/SideMenu";
import Login from "./pages/login/Login"
import Booster from "./pages/booster/Booster";
import Uhr from "./pages/uhr/Uhr";
import OrtsbetriebESTW from "./pages/ortsbetrieb-ESTW/ortsbetrieb-ESTW";
import Zn from "./pages/zn/zn";
import Telefone from "./pages/telefone/Telefone";
import Handregler from "./pages/handregler/Handregler";
import Block from "./pages/block/Block";
import Rechner from "./pages/rechner/Rechner";
import ZnPi from "./pages/zn-pi/zn-pi";
import Stefanie from "./pages/stefanie/Stefanie";
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
    const authenticated = useSelector(state => state["authenticated"]);
    return (
        <div className="App">
            <Router>
                {authenticated? <SideMenu/> : null}
                <div className={"page" + (authenticated? " main" : "")}>
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <AppRoute exact path="/uhr" component={Uhr}/>
                        <AppRoute exact path="/booster" component={Booster}/>
                        <AppRoute exact path="/ortsbetrieb" component={OrtsbetriebESTW}/>
                        <AppRoute exact path="/zn" component={Zn}/>
                        <AppRoute exact path="/telefone" component={Telefone}/>
                        <AppRoute exact path="/block/:id" component={Block}/>
                        <AppRoute exact path="/handregler" component={Handregler}/>
                        <AppRoute exact path="/rechner" component={Rechner}/>
                        <AppRoute exact path="/znpi" component={ZnPi}/>
                        <AppRoute exact path="/stefanie" component={Stefanie}/>
                        <AppRoute component={Uhr}/>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

// route to the main application if authenticated; otherwise redirected to login
function AppRoute({component: View, ...rest}) {

    sessionStorage.setItem("endpoint", rest.computedMatch.url);

    const authenticated = useSelector(state => state["authenticated"]);

    return <Route {...rest} render={
        props => authenticated ? <View {...props}/> : <Redirect to={{pathname: "/login"}}/>
    }/>;
}

export default App;