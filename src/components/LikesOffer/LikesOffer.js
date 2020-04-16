import React from "react";
import "./LikesOffer.sass";
import packet1 from "../../files/icons/likes-packet1.svg";
import packet2 from "../../files/icons/likes-packet2.svg";
import NumberInput from "../UI/Inputs/NumberInput/NumberInput";
import ButtonWithIcon from "../UI/Buttons/ButtonWithIcon/ButtonWithIcon";
import CodoAPI from "../../services/CodoAPI/CodoAPI";


class LikesOffer extends React.Component {
    state = {
        packetCounts: 1,
        minCount: 1,
        maxCount: 100,
    }

    onMinusHandle() {
        if (this.state.packetCounts === 1) return;
        this.setState((state, props) => ( {
            packetCounts: state.packetCounts - 1,
        } ))
    }

    onPlusHandle() {
        if (this.state.packetCounts < this.state.maxCount) {
            this.setState((state, props) => ( {
                packetCounts: state.packetCounts + 1,
            } ))
        }
    }

    onPacketCountsChangeHandle(event) {
        let number = +event.target.value;

        if(number < this.state.minCount) {
            this.setState({
                packetCounts: Math.round(this.state.minCount),
            });

            event.target.value = this.state.minCount;
            return;
        }

        if (number < 0) number = -number;

        if (number <= this.state.maxCount) {
            this.setState({
                packetCounts: Math.round(number),
            });

            event.target.value = number;
        }
    }

    render() {
        return (
            <div className="LikesOffer">
                <div className="LikesOffer-LikesCount">{ this.props.counts } шт.</div>
                <div className="LikesOffer-PacketWrapper">
                    <img className="LikesOffer-Packet" src={ this.props.type === '1' ? packet1 : packet2 } alt=""/>
                </div>

                <div className="LikesOffer-ControlWrapper">
                    <div className="LikesOffer-Control">
                        <span className="LikesOffer-Label">Количество</span>
                        <NumberInput
                            value={ this.state.packetCounts }
                            onChange={ this.onPacketCountsChangeHandle.bind(this) }
                            onMinus={ this.onMinusHandle.bind(this) }
                            onPlus={ this.onPlusHandle.bind(this) }/>
                    </div>
                    <div className="LikesOffer-Control LikesOffer-ControlMargin">
                        <span className="LikesOffer-Label LikesOffer-LabelMargin">Цена</span>
                        {
                            this.props.oldPrice
                                ? <span
                                    className="LikesOffer-OldPrice">{ String(this.props.oldPrice * this.state.packetCounts).replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ") } ₽</span>
                                : null
                        }

                        <span
                            className="LikesOffer-Price">{ ( '' + ( this.props.price * this.state.packetCounts ) ).replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ") } ₽</span>
                    </div>
                    <ButtonWithIcon className="ButtonBuy" onClick={ () => {
                        CodoAPI.VKAPI.openPayForm('likes', this.props.type, this.state.packetCounts);
                    } }>Купить</ButtonWithIcon>
                </div>
            </div>
        )
    }
}

export default LikesOffer;
