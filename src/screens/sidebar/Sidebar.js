import './sidebar.css'
import sdk from "../../voxImplantConfig";
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import {Avatar, IconButton} from '@mui/material'
import firebase from '../../Firebase/firebaseConfig';
import * as Voximplant from "voximplant-websdk";
import {LogoutOutlined, QrCode} from '@mui/icons-material'
import {UpdateUserImage} from "../../Firebase/Users";
import {useDispatch} from "react-redux";
import {addCall} from "../../actions/callActions";
import {DISCONNECT} from "../../Constants";

export default function Sidebar() {

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [imageUrl, setImageUrl] = useState('')
    const [allUsers, setAllUsers] = useState(null)
    const [loggedInUserName, setLoggedInUser] = useState('')

    useEffect(() => {

        if (sdk.getClientState().toString() === 'DISCONNECTED')
            navigate('/login')

    }, [allUsers])

    useEffect(() => {

        try {
            firebase.database()
                .ref('users')
                .on('value', async datasnapshot => {
                    const uuid = localStorage.getItem('UID');
                    if (uuid === null)
                        return;
                    new Promise((resolve, reject) => {
                        let users = [];
                        let lastMessage = '';
                        let lastDate = '';
                        let lastTime = '';
                        let properDate = '';
                        datasnapshot.forEach(child => {
                            if (child.val().uuid === uuid) {
                                setLoggedInUser(child.val().name)
                                setImageUrl(child.val().image)
                            } else {
                                let newUser = {
                                    userId: '',
                                    userName: '',
                                    userProPic: '',
                                    lastMessage: '',
                                    lastDate: '',
                                    lastTime: '',
                                    properDate: '',
                                };
                                new Promise((resolve, reject) => {
                                    firebase
                                        .database()
                                        .ref('messages')
                                        .child(uuid)
                                        .child(child.val().uuid)
                                        .orderByKey()
                                        .limitToLast(1)
                                        .on('value', dataSnapshots => {
                                            if (dataSnapshots.val()) {
                                                dataSnapshots.forEach(child => {
                                                    lastMessage =
                                                        child.val().messege.image !== ''
                                                            ? 'Photo'
                                                            : child.val().messege.msg;
                                                    lastDate = child.val().messege.date;
                                                    lastTime = child.val().messege.time;
                                                    properDate =
                                                        child.val().messege.date +
                                                        ' ' +
                                                        child.val().messege.time;
                                                });
                                            } else {
                                                lastMessage = '';
                                                lastDate = '';
                                                lastTime = '';
                                                properDate = '';
                                            }
                                            newUser.userId = child.val().uuid;
                                            newUser.userName = child.val().name;
                                            newUser.userProPic = child.val().image;
                                            newUser.lastMessage = lastMessage;
                                            newUser.lastTime = lastTime;
                                            newUser.lastDate = lastDate;
                                            newUser.properDate = properDate;
                                            return resolve(newUser);
                                        });
                                }).then(newUser => {
                                    users.push({
                                        userName: newUser.userName,
                                        uuid: newUser.userId,
                                        imageUrl: newUser.userProPic,
                                        lastMessage: newUser.lastMessage,
                                        lastTime: newUser.lastTime,
                                        lastDate: newUser.lastDate,
                                        properDate: newUser.lastDate
                                            ? new Date(newUser.properDate)
                                            : null,
                                    });
                                    setAllUsers(users.sort((a, b) => b.properDate - a.properDate))
                                    localStorage.setItem('users', JSON.stringify(users.sort((a, b) => b.properDate - a.properDate)))
                                });
                                return resolve(users);
                            }
                        });
                    }).then(users => {
                        setAllUsers(users.sort((a, b) => b.properDate - a.properDate))
                    });
                });
        } catch (error) {
            alert(error);
        }

        sdk.on(
            Voximplant.Events.IncomingCall,
            incomingCallEvent => {

                dispatch(addCall(incomingCallEvent.call))

                navigate('/IncomingCall')
            },
        );

        return () => {
            sdk.off(Voximplant.Events.IncomingCall);
        };
    }, [navigate, sdk])


    const logOut = async () => {

        dispatch({
            type: DISCONNECT
        })
        await sdk.disconnect();
        console.log('Disconnected')
        await firebase
            .auth()
            .signOut()
            .then(async () => {
                await localStorage.removeItem('UID');
                navigate('/login');
            })
            .catch(err => {
                console.log(err);
            });
    };

    function updateUSerImg() {

        function getBase64(file, cb) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                cb(reader.result)
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }

        // ImagePicker.openPicker({
        //     width: 300,
        //     height: 400,
        //     cropping: true,
        // }).then(image => {
        //     ImgToBase64.getBase64String(image.path)
        //         .then(async base64String => {
        //             const uid = localStorage.getItem('UID');
        //             let source = 'data:image/jpeg;base64,' + base64String;
        //             UpdateUserImage(source, uid).then(() => {
        //                 setImageUrl(source)
        //             });
        //         })
        //         .catch(err => {
        //         });
        // });
    }


// ****************************************************************

    return (
        <div className='sidebar'>
            <div className="sidebar_header">
                <Avatar src={imageUrl} onClick={updateUSerImg}/>
                <p className='text-white mt-2 font-monospace text-lg-center'>{loggedInUserName && (loggedInUserName[0].toUpperCase() + loggedInUserName.slice(1))}</p>
                <div className='sidebar_header_right'>
                    <IconButton onClick={() => {
                        navigate('scan')
                    }}>
                        <QrCode/>
                    </IconButton>
                    <IconButton onClick={logOut}>
                        <LogoutOutlined/>
                    </IconButton>
                </div>
            </div>

            {/*<div className='sidebar_search'>*/}
            {/*    <div className='sidebar_search_field'>*/}
            {/*        <SearchOutlined />*/}
            {/*        <input placeholder='Search for chats' type="text"/>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className='sidebar_chats'>
                {/*<SidebarChat addNewChat />*/}

                <div className='all_chats'>
                    {JSON.parse(localStorage.getItem('users')) && JSON.parse(localStorage.getItem('users')).map(user => (
                        <div className='sidebarChat_div'
                             onClick={() => {
                                 localStorage.setItem('user', JSON.stringify(user))
                                 localStorage.setItem('guestUid', user.uuid)
                                 navigate('/', {
                                     user: user,
                                     guestUid: user.uuid,
                                 })
                             }}
                             key={user.uuid}
                        >
                            <div className='sidebarChat'>

                                <Avatar src={user.imageUrl === ''
                                    ? 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'
                                    : user.imageUrl}/>
                                <div className='sidebarChat_info'>
                                    <h2>{user.userName[0].toUpperCase() + user.userName.slice(1)}</h2>
                                    <p className='last_message'>{user.lastMessage.length > 16 ? user.lastMessage.slice(0, 16) + '...' : user.lastMessage}</p>
                                </div>
                                <div className='msgDateTime'>
                                    <p className=''>{user.lastDate}</p>
                                    <p className='msgTime'>{user.lastTime}</p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}


