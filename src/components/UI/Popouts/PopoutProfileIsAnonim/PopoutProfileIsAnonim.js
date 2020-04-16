import React, { Component } from 'react';
import "./PopoutProfileIsAnonim.sass";
import melikes from "../../../../files/icons/melikes-red.svg";
import ButtonWithIcon from "../../Buttons/ButtonWithIcon/ButtonWithIcon";
import { connect } from "react-redux";


class PopoutProfileIsAnonim extends Component {
    render() {
        return (
            <div className="PopoutProfileIsAnonim" onClick={ event => event.stopPropagation() }>
                <button className="PopoutProfileIsAnonim-ButtonClose" onClick={ this.props.onPopoutClose }></button>

                <div className="PopoutProfileIsAnonim-Info"/>

                <span className="PopoutProfileIsAnonim-UserName">{ this.props.user.firstName }</span>
                <p className="PopoutProfileIsAnonim-UserDescription">
                    Данный пользователь скрыл свою страницу <span
                    style={ { textDecoration: 'underline' } }>ВКонтакте</span>.
                </p>
                <ButtonWithIcon
                    className="PopoutProfileIsAnonim-ButtonOpen ButtonBattle ButtonBattle_big ButtonOk"
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

export default connect(mapStateToProps)(PopoutProfileIsAnonim);
