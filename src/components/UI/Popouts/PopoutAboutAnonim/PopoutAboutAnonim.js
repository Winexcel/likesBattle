import React, { Component } from 'react';
import "./PopoutAboutAnonim.sass";
import ilikes from "../../../../files/icons/ilikes-red.svg";
import ButtonWithIcon from "../../Buttons/ButtonWithIcon/ButtonWithIcon";
import { connect } from "react-redux";


class PopoutAboutAnonim extends Component {
    render() {
        return (
            <div className="PopoutAboutAnonim" onClick={ event => event.stopPropagation() }>
                <button className="PopoutAboutAnonim-ButtonClose" onClick={ this.props.onPopoutClose }></button>

                <div className="PopoutAboutAnonim-Info"/>

                <span className="PopoutAboutAnonim-UserName">{ this.props.user.firstName }</span>
                <p className="PopoutAboutAnonim-UserDescription">
                    Если ВК скрыт, никто не сможет перейти в твой профиль ВКонтакте.
                </p>
                <ButtonWithIcon
                    className="PopoutMinimumReward-ButtonOpen ButtonBattle ButtonBattle_big ButtonOk"
                    onClick={ this.props.onClick }
                >
                    Понятно
                </ButtonWithIcon>
                <span className="PopoutAboutAnonim-SubText">Доступно для 18+</span>


            </div>
        );

    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(PopoutAboutAnonim);
