import React, {useEffect, useRef, useState} from 'react'
import './videoCall.css'
import CallEndIcon from '@mui/icons-material/CallEnd';
import {Mic, MicOff, Videocam, VideocamOff} from '@mui/icons-material';
import {IconButton} from '@mui/material'
import * as VoxImplant from 'voximplant-websdk';
import {useNavigate} from 'react-router-dom'
import sdk from "../../voxImplantConfig";
import {useDispatch, useSelector} from "react-redux";
import {CLEAR_CALL} from "../../Constants";

export default function VideoCallScreen(props) {
    const [isMute, setIsMute] = useState(false);
    const [isVideoCam, setIsVideoCam] = useState(true);
    const [callStatus, setCallStatus] = useState('Initializing...');

    const user = JSON.parse(localStorage.getItem('user'))
    const isIncomingCall = JSON.parse(localStorage.getItem('isIncomingCall'))

    const incomingCall = useSelector(state => state.call)

    const call = useRef(incomingCall);
    const endpoint = useRef(null);

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const onToggleCamera = () => {
        setIsVideoCam(!isVideoCam);
        call.current.sendVideo(!isVideoCam);
    };

    const onToggleMicrophone = () => {

        let temp = !isMute

        setIsMute(!isMute);
        !temp ? call.current.unmuteMicrophone() : call.current.muteMicrophone()
    };

    useEffect(() => {

        sdk.showLocalVideo(true);
        const streamManager = VoxImplant.Hardware.StreamManager.get();

        streamManager.on(VoxImplant.Hardware.HardwareEvents.BeforeMediaRendererRemoved, (e) => {
        });
        streamManager.on(VoxImplant.Hardware.HardwareEvents.MediaRendererRemoved, (e) => {
        });

        streamManager.on(VoxImplant.Hardware.HardwareEvents.MediaRendererAdded, (e) => {
            let localNode = document.getElementById('localvideo');
            e.renderer.render(localNode);
        });

        streamManager.on(VoxImplant.Hardware.HardwareEvents.MediaRendererUpdated, (e) => {
        });

        if (isIncomingCall) {
            answerCall();
        } else {
            makeCall();
        }

        return () => {
            call.current.off(VoxImplant.CallEvents.Failed);
            call.current.off(VoxImplant.CallEvents.ProgressToneStart);
            call.current.off(VoxImplant.CallEvents.Connected);
            call.current.off(VoxImplant.CallEvents.Disconnected);
        };
    }, [isIncomingCall]);


    const makeCall = async () => {
        const callSettings = {
            number: user.userName,
            video: {
                sendVideo: true,
                receiveVideo: true,
            },
        };
        call.current = await sdk.call(callSettings);
        subscribeToCallEvents();
    };


    const answerCall = async () => {

        subscribeToCallEvents();
        endpoint.current = call.current.getEndpoints()[0];
        subscribeToEndpointEvent();

        call.current.answer(null, {}, {receiveVideo: true, sendVideo: true})
    }

    const subscribeToCallEvents = () => {
        call.current.on(VoxImplant.CallEvents.Failed, callEvent => {
            showError(callEvent.reason);
        });
        call.current.on(VoxImplant.CallEvents.ProgressToneStart, callEvent => {
            setCallStatus('Calling...');
        });
        call.current.on(VoxImplant.CallEvents.Connected, callEvent => {
            setCallStatus('Connected');
        });
        call.current.on(VoxImplant.CallEvents.Disconnected, callEvent => {
            dispatch({
                type: CLEAR_CALL
            })
            navigate('/');
        });

        call.current.on(VoxImplant.CallEvents.EndpointAdded, callEvent => {
            endpoint.current = callEvent.endpoint;
            subscribeToEndpointEvent()
        });
    };

    const subscribeToEndpointEvent = async () => {
        endpoint.current.on(
            VoxImplant.EndpointEvents.RemoteMediaAdded,
            endpointEvent => {
                const container = document.getElementById("remotevideo");
                endpointEvent.mediaRenderer.render(container);
            },
        );
    };

    const showError = reason => {
        console.log(reason)
        alert(`Call failed\nReason: ${reason}`)
        navigate('/')
    }

    const onHangupPress = () => {
        call.current.hangup();
    };

    return (
        <div className='video_call_main text-white'>
            <div className='video_call_header'>
                <p>{callStatus}</p>
                <p>{user && (user.userName[0].toUpperCase() + user.userName.slice(1))}</p>
            </div>

            <div className='video-container'>
                <div id="remotevideo" className='video_call_div'/>
                <div id="localvideo" className='box_overlay'/>
            </div>

            <div className='video_call_footer'>
                <div className='video_call_footer_icons'>
                    <div className='container icon_1'>
                        <IconButton
                            onClick={() => onToggleMicrophone()}
                        >
                            {!isMute ? <Mic/> : <MicOff/>}
                        </IconButton>
                    </div>
                    <div className='container icon_2'>
                        <IconButton
                            onClick={() => onToggleCamera()}
                        >
                            {isVideoCam ? <Videocam/> : <VideocamOff/>}
                        </IconButton>
                    </div>
                    <div id='endcall' className='container icon_3'>
                        <IconButton onClick={onHangupPress}>
                            <CallEndIcon/>
                        </IconButton>
                    </div>

                </div>
            </div>
        </div>
    )
}
