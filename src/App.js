import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React from 'react'
import "./App.css"
import Home from "./screens/Home";
import ScanScreen from './screens/ScanScreen';
import Login from "./screens/Login";
import Register from "./screens/Register";
import IncomingCall from './screens/incommingCallScreen/IncommingCall';
import VideoCallScreen from './screens/videoCallScreen/VideoCallScreen';


function App() {

    return (
        <BrowserRouter>
            <main className="app">

                <Routes>
                    <Route exact path="/login" element={<Login/>}/>
                    <Route exact path="/" element={<Home/>}/>
                    <Route exact path="/register" element={<Register/>}/>
                    <Route exact path="/scan" element={<ScanScreen/>}/>
                    <Route exact path="/IncomingCall" element={<IncomingCall/>}/>
                    <Route exact path="/Call" element={<VideoCallScreen/>}/>
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;

