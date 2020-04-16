import React from "react";
import "./Icon.sass";

import topIcon from "../../../files/icons/top.svg";
import topIconActive from "../../../files/icons/top_active.svg";
import BattleIcon from "../../../files/icons/vs.svg";
import BattleIconActive from "../../../files/icons/vs_active.svg";
import likesIcon from "../../../files/icons/likes.svg";
import likesIconActive from "../../../files/icons/likes_active.svg";
import packetsIcon from "../../../files/icons/packets.svg";
import packetsIconActive from "../../../files/icons/packets_active.svg";
import profileIcon from "../../../files/icons/profile_inactive.svg";
import profileIconActive from "../../../files/icons/profile_active.svg";

const Icon = props => {
    let icon = null,
        iconActive = null;

    switch (props.type.toUpperCase()) {
        case 'TOP':
            icon = topIcon;
            iconActive = topIconActive;
            break;
        case 'BATTLE':
            icon = BattleIcon;
            iconActive = BattleIconActive;
            break;
        case 'LIKES':
            icon = likesIcon;
            iconActive = likesIconActive;
            break;
        case 'IWANTLIKES':
            icon = packetsIcon;
            iconActive = packetsIconActive;
            break;
        case 'PROFILE':
            icon = profileIcon;
            iconActive = profileIconActive;
            break;
        default:
            icon = topIcon;
            iconActive = topIconActive;
    }

    return (
        <>
            { props.isActive
                ? <img className="Icon" src={ iconActive } alt="iconActive"/>
                : <img className="Icon" src={ icon } alt="icon"/>
            }
        </>
    )
};

export default Icon;
