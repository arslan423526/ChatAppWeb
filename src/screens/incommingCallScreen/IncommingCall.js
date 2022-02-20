import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import './incommingCall.css'
import {useNavigate} from "react-router-dom";
import {CLEAR_CALL} from '../../Constants'
import {useDispatch, useSelector} from "react-redux";


const IncomingCall = () => {

    const call = useSelector(state => state.call)

    const caller = call.settings.displayName
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onDecline = () => {
        call.decline({});
        dispatch({
            type: CLEAR_CALL
        })
        navigate('/')
    };

    const onAccept = () => {
        localStorage.setItem('isIncomingCall', JSON.stringify(true))
        navigate('/Call')
    };

    return (
        <div className='incomming_call_bg text-white'>
            <div className='incomming_call_header'>
                <h6 style={{fontWeight: 'bold', fontSize: 28, margin: 30}}>{caller}</h6>
                <p>Incoming Call</p>
            </div>


            <div className='incomming_call_btns mx-4'>
                {/* Decline Button */}
                <div className='decline_btn' onClick={onDecline}>
                    <CancelIcon/>
                    <p className=''>Decline</p>
                </div>


                {/* Accept Button */}
                <div className='accept_btn' onClick={onAccept}>
                    <CheckCircleIcon/>
                    <p className=''>Accept</p>
                </div>

            </div>
        </div>
    );
};


export default IncomingCall;
