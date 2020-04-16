import React, { Component } from 'react';
import "./PopoutMinimumReward.sass";
import melikes from "../../../../files/icons/melikes-red.svg";
import ButtonWithIcon from "../../Buttons/ButtonWithIcon/ButtonWithIcon";
import { connect } from "react-redux";


class PopoutMinimumReward extends Component {
    render() {
        return (
            <div className="PopoutMinimumReward" onClick={ event => event.stopPropagation() }>
                <button className="PopoutMinimumReward-ButtonClose" onClick={ this.props.onPopoutClose }></button>

                <div className="PopoutMinimumReward-Info"/>

                <span className="PopoutMinimumReward-UserName">{ this.props.user.firstName }</span>
                <p className="PopoutMinimumReward-UserDescription">
                    Минимальная награда <img className="UserStats-ItemIcon PopoutMinimumReward-ItemIcon" src={ melikes }
                                             alt="likes"/>&nbsp;<span
                    className="PopoutMinimumReward-UserDescriptionCounter">1</span>&nbsp;
                    будь онлайн и забирай!
                </p>
                <ButtonWithIcon
                    className="PopoutMinimumReward-ButtonOpen ButtonBattle ButtonBattle_big ButtonOk"
                    onClick={ this.props.onClick }
                >
                    Понятно
                </ButtonWithIcon>

            </div>
        );

    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(PopoutMinimumReward);
