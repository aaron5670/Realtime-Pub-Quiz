import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import allReducers from './action-reducers/store';
import {applyMiddleware} from "redux";

import {BrowserRouter as Router} from "react-router-dom";

// The logger middleware is adapted from code out of http://www.pro-react.com/materials/ch06-alt-redux.pdf.
// We use it because it is also useful to see the redux-actions happening in the normal console
// (together with error-messages).
// const logger = (store) => (next) => (action) => {
//     let result = next(action);
//     return result;
// };

export const theStore = Redux.createStore(allReducers,
    applyMiddleware(
        // logger
    ));



const mainComponent =
    <ReactRedux.Provider store={theStore}>
        <Router>
            <App/>
        </Router>
    </ReactRedux.Provider>;

ReactDOM.render(mainComponent, document.getElementById('root'));

