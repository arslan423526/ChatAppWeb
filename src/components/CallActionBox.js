import React, {useState} from 'react'
import './callActionBox.css'
import CallEndIcon from '@mui/icons-material/CallEnd';
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import { IconButton } from '@mui/material'


export default function CallActionBox() {
    const [isMute, setIsMute] = useState(true);
    const [isVideoCam, setIsVideoCam] = useState(true);
    
  return (
    <div>

        <div className='video_call_footer_icons'>
            <div className='container icon_1'>
                <IconButton
                    onClick = {() => setIsMute(!isMute)}
                >
                    {isMute ? <Mic/> : <MicOff/>}
                </IconButton>
            </div>
            <div className='container icon_2'>
            <IconButton
                    onClick = {() => setIsVideoCam(!isVideoCam)}
                >
                    {isVideoCam ? <Videocam/> : <VideocamOff/>}
                </IconButton>
            </div>
            <div className='container icon_3'>
                <IconButton>
                    <CallEndIcon/>
                </IconButton>
            </div>
            
        </div>

    </div>
  )
}
