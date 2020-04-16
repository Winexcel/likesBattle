import React, { Component } from 'react';
import "./PopoutNoLikes.sass";
import coin from "../../../../files/icons/icon-coinRed.svg";
import ButtonWithIcon from "../../Buttons/ButtonWithIcon/ButtonWithIcon";
import { connect } from "react-redux";


class PopoutNoLikes extends Component {
    render() {
        return (
            <div className="PopoutNoLikes" onClick={ event => event.stopPropagation() }>
                <button className="PopoutNoLikes-ButtonClose" onClick={ this.props.onPopoutClose }></button>

                <div className="PopoutNoLikes-Info"/>

                <span className="PopoutNoLikes-UserName">{ this.props.user.firstName }</span>
                <p className="PopoutNoLikes-UserDescription">
                    Ты слишком мало { this.props.user.sex === 1 ? 'оценила' : 'оценил' } людей в лайкобатле.
                    Требуется <span
                    className="PopoutNoLikes-UserDescriptionCounter">50</span>&nbsp;
                    <img className="PopoutNoLikes-UserDescriptionILikes" src={ coin } alt=""/>
                </p>
                <ButtonWithIcon
                    className="PopoutNoLikes-ButtonOpen ButtonBattle ButtonBattle_big"
                    onClick={ this.props.onClick }
                >
                    Батлиться
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

export default connect(mapStateToProps)(PopoutNoLikes);
