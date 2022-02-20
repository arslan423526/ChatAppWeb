import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {ACC_NAME, APP_NAME} from "../Constants";
import {LoginUser} from "../Firebase/LoginUser";
import Firebase from "firebase";
import sdk from "../voxImplantConfig";


export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    useEffect(async () => {

        await sdk.init({
            micRequired: true,
            videoSupport: true,
            progressTone: true,
            localVideoContainerId: "localvideo",
            remoteVideoContainerId: "remotevideo",
        }).then(r => console.log(r)
        );

        await sdk.connect().then(r => console.log(r));

    }, [])

    const login = async () => {

        let check = true

        try {

            try {
                const fqUsername = `${
                    email.split('@')[0]
                }@${APP_NAME}.${ACC_NAME}.voximplant.com`;

                await sdk.login(fqUsername, password);

                console.log("Logged in!");
            } catch (e) {
                console.log(e);
                check = false
            }
        } catch (e) {
            console.log("Connection failed!");
        }
        return check
    };

    const LoginToFirebase = async () => {
        if (!email) {
            return alert('Please Enter Email');
        }
        if (!password) {
            return alert('Please Enter Password');
        }

        if (!await login())
            return

        await LoginUser(email, password)
            .then(async res => {
                console.log('res', res);
                const uid = Firebase.auth().currentUser.uid;
                await localStorage.setItem('UID', uid);
                navigate('/');
            })
            .catch(async err => {
                await sdk.disconnect();
                alert('Invalid Credentials');
            });
    }

    return (<div className="loginContainer">
            <div className="inner">
                <div className="logo">Messenger</div>
                <div className="title">Login</div>

                <input value={email}
                       onChange={e => {
                           setEmail(e.target.value)
                       }}
                       type='email'
                       className="input-field" placeholder="Email"
                />
                <div className="input-container">
                    <input
                        className="input-field"
                        placeholder="Password"
                        value={password}
                        // onChange={() => setPassword}
                        onChange={e => {
                            setPassword(e.target.value)
                        }}
                        type="password"
                    />
                </div>

                <button style={{borderRadius: 15}} onClick={LoginToFirebase} type="submit">Login</button>

                <div className="switchOption">
                    Dont have an account yet? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    )
}

