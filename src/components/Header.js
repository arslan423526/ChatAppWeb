import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import * as React from "react";


function Header() {
    return (

        <div>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{borderBottom: (theme) => `1px solid ${theme.palette.divider}`,boxShadow: 10, bgcolor: "#2196F3"}}
            >
                <Toolbar sx={{flexWrap: 'wrap'}}>
                    <Typography variant="h5" color="inherit" noWrap sx={{flexGrow: 1, color: "white", fontStyle:"bold"}}>
                        Emergency Patient
                    </Typography>

                    <Link to={`/`} style={{ textDecoration: 'none' }}><Button variant="outlined" sx={{my: 1, mx: 1.5, borderColor: "white", bgcolor:"#001856", borderRadius: 10, color: "white"}}>
                        Symptomes
                    </Button></Link>

                    <Link to={`/login`} style={{ textDecoration: 'none' }}><Button className="navlink" variant="outlined" sx={{my: 1, mx: 1.5, borderRadius: 10, bgcolor:"#4CAF50", borderColor: "white", color: "white"}}>
                        Sign in
                    </Button></Link>

                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header
