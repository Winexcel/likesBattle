import React, { Component } from 'react';
import "./LikesOffer2.sass";
import packet1 from "../../files/icons/likes-packet1.svg";
import packet2 from "../../files/icons/likes-packet2.svg";
import CodoAPI from "../../services/CodoAPI/CodoAPI";
import ButtonWithIcon from "../UI/Buttons/ButtonWithIcon/ButtonWithIcon";

class LikesOffer2 extends Component {
    render() {
        return (
            <div className="LikesOffer2">
                <div className="LikesOffer2-PacketWrapper">
                    <img className="LikesOffer2-Packet" src={ this.props.type === '1' ? packet1 : packet2 }
                         alt="Packet type"/>
                </div>

                <div className="LikesOffer2-PacketInfo">
                    <div className="LikesOffer2-PacketName">{ this.props.type === '1' ? '100' : '1000' } шт.</div>
                    <div className="LikesOffer2-PacketPrice">{ this.props.price } &#x20bd;</div>
                </div>
                <ButtonWithIcon className="ButtonBuy ButtonBuy2 ButtonBuy_noicone" onClick={ () => {
                    CodoAPI.VKAPI.openPayForm('likes', this.props.type, 1);
                } }>Купить</ButtonWithIcon>
            </div>
        );

    }
}

export default LikesOffer2;
