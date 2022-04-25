import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { datastore } from './states';
import { initSocketConnection } from './repository';
import "./index.css";

// case the token is still valid, initialize the socket connection 
initSocketConnection();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={datastore}>
           <App />
        </Provider> 
    </React.StrictMode>,
    document.getElementById('root')
);

