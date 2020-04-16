import React from 'react';
import Layout from "./hoc/Layout/Layout";
import PopoutGuideTour from "./components/UI/Popouts/PopoutGuideTour/PopoutGuideTour";
import CodoAPI from "./services/CodoAPI/CodoAPI";
import { withRouter } from "react-router-dom";

export const GlobalContext = React.createContext({});

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * ( max - min + 1 );
    return Math.round(rand);
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStory: 'BATTLE',
            content: "some content will be here",
            user: {
                likesCount: 259,
                melikes: Math.round(Math.random() * 10000),
                ilikes: Math.round(Math.random() * 10000),
            },
        };
    };

    handleStoryChange = (e) => {
        /* Прокрутка нужна для переключения между табами */
        window.scrollTo(0, 0);
        window.scroll(0, 0);

        this.setState({
            activeStory: e.currentTarget.dataset.story
        });
    };

    popoutNoLikesClickHandle() {
        this.goBattleClickHandle();
    }

    goBattleClickHandle() {
        console.log(this.props);
        this.setState({
            activeStory: 'BATTLE'
        });
        this.props.history.push('/');
    }

    isPlatformSupport() {
        let uA = navigator.userAgent.toUpperCase();
        let majorIOSVersion = null;
        //Если версия айфона меньше 10-й то показываем заглушку о неподдержке
        if (uA.includes("IPHONE OS")) {
            let copy1 = uA.slice(uA.indexOf("OS") + 3);
            majorIOSVersion = +copy1.slice(0, copy1.indexOf("_"));
            if (Number.isInteger(majorIOSVersion) && majorIOSVersion < 9) {
                return {
                    iosVersion: majorIOSVersion,
                    support: false,
                };
            }

            return {
                iosVersion: majorIOSVersion,
                support: true,
            }
        }

        return {
            support: true
        };
    }

    componentDidMount() {
        this.setState({ activeStory: 'BATTLE' });
    }

    componentWillUnmount() {
        CodoAPI.VKAPI.stopStatusBarUpdater();
    }

    render() {
        return (
            <>
                { this.isPlatformSupport().support
                    ? (
                        <GlobalContext.Provider value={ {
                            popoutNoLikesClickHandle: this.popoutNoLikesClickHandle.bind(this),
                            goBattleClickHandle: this.goBattleClickHandle.bind(this),
                        } }>
                            <Layout
                                activeStory={ this.state.activeStory }
                                onStoryChange={ this.handleStoryChange }
                            />
                        </GlobalContext.Provider>
                    )
                    : 'Sorry, but this platfrom isn\'t support'
                }
            </>
        );
    };
}

export default withRouter(App);

