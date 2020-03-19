import React, {useState, useEffect} from "react";
import queryString from "query-string";
import io from "socket.io-client";

import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages.js";
import TextContainer from "../TextContainer/TextContainer";
import "./Chat.css"

let socket;

const Chat = ({location}) => {

    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsersAvailable] = useState([]);
    const ENDPOINT = "localhost:5000";



    useEffect(() => {
        const {name, room} = queryString.parse(location.search);
        
        socket = io(ENDPOINT);

        socket.emit("join", {name, room}, () => {
            //alert(error)
        })
        setName(name);
        setRoom(room);

        return () => {
            socket.emit("disconnect");
            socket.off()
        }

    },[ENDPOINT, location.search])
    
    useEffect(() => {
        socket.on("message", (message) => {
            setMessages([...messages, message])
        })
    },[messages])

    useEffect(() => {
        socket.on("roomData", ({users}) => {
            console.log(users)
            setUsersAvailable([...users])
        })
    },[users])

    const sendMessage = event => {

        event.preventDefault();

        if(message) {
            socket.emit("sendMessage", message, () => {
                console.log("list of users",messages)
                setMessage("")
                setUsersAvailable([...messages])
            })
        }
    }
    console.log("all data",users)
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users}/>
        </div>
    );
}

export default Chat;