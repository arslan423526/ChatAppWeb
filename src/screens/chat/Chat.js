import {
    CameraAltOutlined,
    Videocam
} from '@mui/icons-material'
import {Avatar, IconButton} from '@mui/material'
import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {SendMessage, RecieveMessage} from '../../Firebase/Message';
import firebase from '../../Firebase/firebaseConfig';
import './chat.css'
import '../../style.scss'

export default function Chat() {

    const navigate = useNavigate();

    const [input, setInput] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [image, setImage] = useState("");

    const user = JSON.parse(localStorage.getItem('user'))
    const currentUid = localStorage.getItem('UID')
    const guestUid = localStorage.getItem('guestUid')

    useEffect(() => {

        async function fetch() {
            try {
                await firebase
                    .database()
                    .ref('messages')
                    .child(currentUid)
                    .child(guestUid)
                    .on('value', dataSnapshot => {
                        let setMessage = [];

                        dataSnapshot.forEach(data => {
                            setMessage.push({
                                sendBy: data.val().messege.sender,
                                recieveBy: data.val().messege.reciever,
                                msg: data.val().messege.msg,
                                image: data.val().messege.image,
                                date: data.val().messege.date,
                                time: data.val().messege.time,
                            });
                        });
                        setAllMessages(setMessage.reverse());
                    });
            } catch (error) {
                alert(error);
            }
        }

        currentUid && guestUid && fetch().then(r => {
        })

        return () => {
        }

    }, [currentUid, guestUid])

    function openGallery() {

        // ImagePicker.openPicker({
        //   width: 300,
        //   height: 400,
        //   cropping: true,
        // }).then(image => {
        //   ImgToBase64.getBase64String(image.path)
        //     .then(async base64String => {
        //       let source = 'data:image/jpeg;base64,' + base64String;
        //       SendMessage(currentUid, guestUid, '', source)
        //         .then(res => {
        //         })
        //         .catch(err => {
        //           alert(err);
        //         });
        //
        //       RecieveMessage(currentUid, guestUid, '', source)
        //         .then(res => {
        //         })
        //         .catch(err => {
        //           alert(err);
        //         });
        //     })
        //     .catch(err => alert(err));
        // });

    }


    async function sendMessage(e) {
        e.preventDefault();
        if (input) {
            SendMessage(
                currentUid,
                guestUid,
                input,
                '',
            )
                .then(res => {
                    setInput('')
                })
                .catch(err => {
                    alert(err);
                });

            RecieveMessage(
                currentUid,
                guestUid,
                input,
                '',
            )
                .then(res => {
                    setInput('')
                })
                .catch(err => {
                    alert(err);
                });
        }
    }

    // *********************************** Video Call *************************

    return (
        user ?
            <div className='chat'>
                <div className='chat_header'>
                    <Avatar src={user && user.imageUrl}/>
                    <div className='chat_header_info'>
                        <h3>{user &&(user.userName[0].toUpperCase() + user.userName.slice(1))}</h3>
                        <p className='last_seen'>
                            <p className='last_seen'>

                            </p>
                        </p>
                    </div>

                    {/* ******************************** VONAGE *** */}

                    <div className='chat_header_right'>
                        <IconButton
                            onClick={() => {
                                localStorage.setItem('user', JSON.stringify(user))
                                navigate('/Call')
                            }}
                        >
                            <Videocam/>
                        </IconButton>
                    </div>
                    {/* ***************************************** */}
                </div>

                <div className='chats pt-5'>
                    {allMessages && allMessages.length !== 0 && allMessages.reduceRight(function (arr, last, index, coll) {
                        console.log(last, index);
                        return (arr = arr.concat(last))
                    }, []).map(message => (
                            <div className='chat_body'>
                                <div
                                    className={currentUid !== message.sendBy ? `chat_bubble_sender` : "chat_bubble_reciever"}>
                                    <div className='each_message_div'>
                                        <div
                                            className={currentUid !== message.sendBy ? `chat_message_sender` : "chat_message_reciever"}>
                                            {message.msg === '' ? message.image &&
                                                <img style={{borderRadius: 50}} src={message.image} alt='temp'/> :
                                                <p>{message.msg}</p>}

                                        </div>
                                        <p className='mt-1 message_timestamp flex justify-content-end text-sm-end'>{message.time}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>


                <div className='chat_footer'>
                    <form className='chat_footer_message_form'>
                        <input
                            className="input-field"
                            value={input}
                            onChange={e => {
                                setInput(e.target.value)
                            }}
                            placeholder="Send a message" type="text"
                        />
                        <button style={{width: '10%', minWidth: '80px'}} type='submit' onClick={sendMessage}>Send
                        </button>
                        <CameraAltOutlined/>
                    </form>
                </div>
            </div> :
            <div className='chat justify-content-center align-items-center text-white'><h1>Welcome to Messenger</h1>
            </div>
    )
}

