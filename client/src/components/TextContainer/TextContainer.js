import React from "react";
import onlineIcon from "../../icons/onlineIcon.png"
import "./TextContainer.css";

const TextContainer = ({users}) => {
    console.log("in text container",users)
    return (<div className="container-userlist">

        {users.map((user, id) => <div className="d-flex"><img className="onlineIcon" src={onlineIcon} alt="online"/>
        <div key={id}>{user.name}</div></div>)}

    </div>
    );
}

export default TextContainer;