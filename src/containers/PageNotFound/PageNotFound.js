import React, { Component } from 'react';
import { platform, IOS } from '@vkontakte/vkui';
import "./PageNotFound.sass";
import ButtonWithIcon from "../../components/UI/Buttons/ButtonWithIcon/ButtonWithIcon";
import { GlobalContext } from "../../App";
import ProfileIsPrivate from "../../components/ProfileIsPrivate/ProfileIsPrivate";

class PageNotFound extends Component {
    state = {
        platform: platform(),
        view: null,
    }

    componentDidMount = () => {
        const PanelHeaderHeight = this.state.platform === IOS ? 44 : 56;
        const TabBarHeight = 70;

        let view = {
            display: 'block',
            position: 'relative',
            height: 'calc(100vh - (' + PanelHeaderHeight + 'px + ' + TabBarHeight + 'px + env(safe-area-inset-bottom) + env(safe-area-inset-top)))',
        };

        this.setState({
            view,
        });
    };

    render() {
        return (
            <div className="PageNotFound">
                <span className="PageNotFound-404"/>
                <span className="PageNotFound-Header">Упс!</span>
                <span className="PageNotFound-Message">Такой страницы не существует либо она ещё не создана.</span>
                <GlobalContext.Consumer>{ value => (
                    <ButtonWithIcon
                        className="PageNotFound-ButtonBattle ButtonBattle ButtonBattle_big"
                        onClick={ () => {
                            value.goBattleClickHandle();
                        } }
                    >
                        Батлиться
                    </ButtonWithIcon>
                ) }
                </GlobalContext.Consumer>
            </div>
        );
    }
}

export default PageNotFound;
