import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "./style.scss";
import App from './App';
import reportWebVitals from './reportWebVitals';
import reducer, {initialState} from './reducer';
import {StateProvider} from './StateProvider';
import {Provider} from "react-redux";
import store from "./store";
import {ParallaxProvider} from 'react-scroll-parallax';

localStorage.setItem('user', JSON.stringify(null))
localStorage.setItem('users', JSON.stringify(null))
localStorage.setItem('call', JSON.stringify(null))
localStorage.setItem('guestUid', JSON.stringify(null))
localStorage.setItem('allMessages', JSON.stringify(null))
localStorage.setItem('incomingCall', JSON.stringify(null))
localStorage.setItem('isIncomingCall', JSON.stringify(null))

ReactDOM.render(
    <Provider store={store}>
        <ParallaxProvider>
            <App/>
        </ParallaxProvider>

    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
