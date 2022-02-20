import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {RegisterUser} from "../Firebase/Register";
import Firebase from '../Firebase/firebaseConfig';
import {AddUser} from "../Firebase/Users";

export default function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function RegisterToFirebase() {
        if (!name) {
            return alert('Please Enter Name');
        }
        if (!email) {
            return alert('Please Enter Email');
        }
        if (!password) {
            return alert('Please Enter Password');
        }

        RegisterUser(email, password)
            .then(res => {
                alert(res);
                const userUID = Firebase.auth().currentUser.uid;
                AddUser(name, email, '', userUID)
                    .then(() => {
                        navigate('Login');
                    })
                    .catch(error => {
                        alert(error);
                    });
            })
            .catch(err => {
                alert(err)
                if (err.code === 'auth/email-already-in-use') {
                    alert('That email address is already in use!');
                } else if (err.code === 'auth/invalid-email') {
                    alert('That email address is invalid!');
                } else {
                    alert(err);
                }
            });
    }


    return (
        <div className="loginContainer">
            <div className="inner">
                <div className="logo">Messenger</div>
                <div className="title">Register</div>

                <form>
                    <input
                        className="input-field mb-4"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={e => {
                            setName(e.target.value)
                        }}
                    />

                    <input
                        className="input-field"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value)
                        }}
                    />

                    <div className="input-container">
                        <input
                            className="input-field"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value)
                            }}
                        />
                    </div>
                    <button style={{borderRadius: 15}} onClick={RegisterToFirebase} type="submit">Register</button>
                </form>

                <div className="switchOption">
                    Dont have an account yet? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    )
}
