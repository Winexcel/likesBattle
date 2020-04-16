import React from "react";
import "./ProfileIsPrivate.sass";

const ProfileIsPrivate = props => {
    return (
        <div className={ "ProfileIsPrivate " + (props.className ? props.className : null) }>
            <span className="ProfileIsPrivate-Private"/>
            <span className="ProfileIsPrivate-Header">Упс!</span>
            <span className="ProfileIsPrivate-Message">Пользователь ограничил доступ к фотографиям.</span>
        </div>
    )
}

export default ProfileIsPrivate;
