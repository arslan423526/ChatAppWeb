import React, {useEffect} from 'react'
import Sidebar from './sidebar/Sidebar'
import {Grid} from "@mui/material";
import Chat from "./chat/Chat";

export default function Home() {

    useEffect(()=>{

    },[])

    return (
        <div style={{
        }
        }>
            <div className='app_body'>
                <Grid container>
                    <Grid item md={4} className='grid_1'>
                        <Sidebar/>
                    </Grid>

                    <Grid item md={8} className='grid_1'>
                        <Chat/>
                    </Grid>

                </Grid>

            </div>
        </div>
    )
}
