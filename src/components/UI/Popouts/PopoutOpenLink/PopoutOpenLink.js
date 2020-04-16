import React, { Component } from 'react';
import "./PopoutOpenLink.sass";
import coin from "../../../../files/icons/icon-coinRed.svg";
import ButtonWithIcon from "../../Buttons/ButtonWithIcon/ButtonWithIcon";


class PopoutOpenLink extends Component {
    render() {
        return (
            <div className="PopoutOpenLink" onClick={ event => event.stopPropagation() }>
                <button className="PopoutOpenLink-ButtonClose" onClick={ this.props.onPopoutClose }></button>

                <div className="PopoutOpenLink-AvatarWrapper">
                    <img className="PopoutOpenLink-Avatar" src={ this.props.user.photo } alt="PopoutOpenLink-Avatar"/>
                </div>
                <span className="PopoutOpenLink-UserName">{ this.props.user.firstName }</span>
                <p className="PopoutOpenLink-UserDescription">
                    Открой за <span className="PopoutOpenLink-UserDescriptionCounter">50</span>&nbsp;
                    <img className="PopoutOpenLink-UserDescriptionILikes" src={ coin } alt=""/>
                </p>
                <ButtonWithIcon
                    className="PopoutOpenLink-ButtonOpen ButtonOpen ButtonOpen_big"
                    onClick={ this.props.onOpenUser }
                >
                    Открыть
                </ButtonWithIcon>
            </div>
        );

    }
}

export default PopoutOpenLink;
