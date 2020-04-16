import React, {Component} from 'react';
import {useSwipeable, Swipeable} from 'react-swipeable'

/**
 * Import VKUI
 */
import {View, Epic, Tabbar, TabbarItem, Panel, PanelHeader, platform, IOS, ConfigProvider} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

/**
 * Import all components
 */
import Icon from "../../components/UI/Icon/Icon";
import ButtonFilter from "../../components/UI/Buttons/ButtonFilter/ButtonFilter";
import ButtonBack from "../../components/UI/Buttons/ButtonBack/ButtonBack";

/**
 * Import all pages
 */
import Battle from "../../containers/Battle/Battle";
import Top from "../../containers/Top/Top";
import IWantLikes from "../../containers/IWantLikes/IWantLikes";
import Likes from "../../containers/Likes/Likes";
import ChooseCity from "../../containers/ChooseCity/ChooseCity";
import Filters from "../../containers/Filters/Filters";

/**
 * React-Router-Dom
 */
import {withRouter, Route, NavLink, Switch, Redirect} from "react-router-dom";

/**
 * Styles
 */
import classes from "./Layout.sass";
import PopoutWrapper from "../../components/UI/Popouts/PopoutWrapper/PopoutWrapper";
import PopoutNoInternet from "../../components/UI/Popouts/PopoutNoInternet/PopoutNoInternet";
//import { Detector } from "react-detect-offline";
import {Detector} from "../../vendor/react-detect-offline/index"
import PopoutGuideTour from "../../components/UI/Popouts/PopoutGuideTour/PopoutGuideTour";
import CodoAPI from "../../services/CodoAPI/CodoAPI";
import Profile from "../../containers/Profile/Profile";
import {connect} from "react-redux";
import {filtersChangeAge, filtersChangePlace, filtersChangeSex} from "../../store/actions/filters";
import {
    userUpdateBattlesCount,
    userUpdateFirstName, userUpdateNotificationsEnabled,
    userUpdateOwnLikes, userUpdatePhoto100, userUpdateSex,
    userUpdateUsersLikes
} from "../../store/actions/user";
import {updateOnline} from "../../store/actions/online";

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}


class Layout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            view: null,
            platform: platform(),
            guidTourUnmount: false,
            epic: {
                topView: {
                    activePanel: 'TOP',
                },
                battleView: {
                    activePanel: 'BATTLE',
                },
                likesView: {
                    activePanel: 'LIKES',
                },
                iWantLikesView: {
                    activePanel: 'IWANTLIKES',
                },
                profileView: {
                    activePanel: 'PROFILE',
                },
            },
        };
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
        })

        window.addEventListener('popstate', () => {
            // alert('bb');
        })

        console.log(this.props);
    };

    unmountHandle = () => {
        this.props.onStoryChange({
            currentTarget: {
                dataset: {
                    story: 'BATTLE',
                }
            }
        });

        this.setState({
            guidTourUnmount: true,
        });
    }

    // IOS SWIPE BACK
    swipeHandle = (eventData) => {
        if (eventData.initial[0] < 50) {
            this.props.history.goBack();
        }
    }

    render() {
        const config = {
            delta: 10,
            absX: 3,
        };

        return (
            <Swipeable onSwipedRight={(eventData) => this.swipeHandle(eventData)} {...config} >
                <div className="OverAllWrapper">

                    {
                        CodoAPI.backend.isFirstStart && !this.state.guidTourUnmount
                            ? (<PopoutWrapper onBackDropClick={this.handleBackDropClick}>
                                <PopoutGuideTour onStoryChange={this.props.onStoryChange}
                                                 onUnmountTour={this.unmountHandle}/>
                            </PopoutWrapper>)
                            : (null)
                    }

                    <Detector
                        render={({online}) => {
                            if(this.props.online.online !== online) {
                                this.props.updateOnline(online);
                            }
                            if (online) return null;

                            return <PopoutWrapper onBackDropClick={this.handleBackDropClick}>
                                <PopoutNoInternet/>
                            </PopoutWrapper>
                        }}
                    />

                    <Switch>
                        <Route exact path='/' render={() => {
                            let epic = {...this.state.epic};
                            if (epic.battleView.activePanel !== 'BATTLE' ||
                                epic.profileView.activePanel !== 'PROFILE' ||
                                epic.iWantLikesView.activePanel !== 'IWANTLIKES' ||
                                epic.likesView.activePanel !== 'LIKES' ||
                                epic.topView.activePanel !== 'TOP'
                            ) {
                                epic.battleView.activePanel = 'BATTLE';
                                epic.profileView.activePanel = 'PROFILE';
                                epic.iWantLikesView.activePanel = 'IWANTLIKES';
                                epic.likesView.activePanel = 'LIKES';
                                epic.topView.activePanel = 'TOP';
                                this.setState({epic})
                            }
                        }}/>

                        <Route exact path='/battle/filters' render={() => {
                            let epic = {...this.state.epic};
                            if (epic.battleView.activePanel !== 'BATTLE/FILTERS') {
                                epic.battleView.activePanel = 'BATTLE/FILTERS';
                                this.setState({epic})
                            }
                        }}/>

                        <Route exact path='/battle/chooseCity' render={() => {
                            let epic = {...this.state.epic};
                            if (epic.battleView.activePanel !== 'BATTLE/CHOOSECITY') {
                                epic.battleView.activePanel = 'BATTLE/CHOOSECITY';
                                this.setState({epic})
                            }
                        }}/>

                        <Route exact path='/id:number' render={() => {
                            let epic = {...this.state.epic};
                            if (epic.battleView.activePanel !== 'PROFILE/ID' ||
                                epic.profileView.activePanel !== 'PROFILE/ID' ||
                                epic.likesView.activePanel !== 'PROFILE/ID' ||
                                epic.iWantLikesView.activePanel !== 'PROFILE/ID' ||
                                epic.topView.activePanel !== 'PROFILE/ID'
                            ) {
                                epic.battleView.activePanel = 'PROFILE/ID';
                                epic.profileView.activePanel = 'PROFILE/ID';
                                epic.likesView.activePanel = 'PROFILE/ID';
                                epic.iWantLikesView.activePanel = 'PROFILE/ID';
                                epic.topView.activePanel = 'PROFILE/ID';
                                this.setState({epic})
                            }
                        }}/>

                        <Redirect to="/"/>
                    </Switch>

                    { /*
                    Роутинг работает следующим образом:
                    в activeStory на глобальном уровне выбирается какой экран сейчас показывается, и в таббарах он переключается
                    а в this.state.epic для каждого экрана устанавливаются роуты для внутренних путей, и в зависимости от этого
                    выбирается какую панель рендерить
                */}

                    <ConfigProvider isWebView={true}>
                        <Epic activeStory={this.props.activeStory} tabbar={
                            <Tabbar className={classes.Tabbar}>
                                <TabbarItem
                                    onClick={() => {
                                        //данная проверка нужна чтобы когда юзер переходил с чужого профиля на свой
                                        //то он загружался, если убрать, то будет грузится также чужой профиль
                                        if (~this.props.history.location.pathname.indexOf('id')) this.props.history.goBack();
                                        this.props.onStoryChange({
                                            currentTarget: {
                                                dataset: {
                                                    story: 'TOP',
                                                }
                                            }
                                        })
                                    }}
                                    selected={this.props.activeStory === 'TOP'}
                                    data-story="TOP"
                                >
                                    <Icon type={'TOP'} isActive={this.props.activeStory === 'TOP'}/>
                                </TabbarItem>
                                <TabbarItem
                                    onClick={() => {
                                        if (~this.props.history.location.pathname.indexOf('id')) this.props.history.goBack();
                                        this.props.onStoryChange({
                                            currentTarget: {
                                                dataset: {
                                                    story: 'BATTLE',
                                                }
                                            }
                                        })
                                    }}
                                    selected={this.props.activeStory === 'BATTLE' || this.props.activeStory === 'FILTERS'}
                                    data-story="BATTLE"
                                >
                                    <Icon type={'BATTLE'}
                                          isActive={this.props.activeStory === 'BATTLE'}/>
                                </TabbarItem>
                                <TabbarItem
                                    onClick={() => {
                                        //данная проверка нужна чтобы когда юзер переходил с чужого профиля на свой
                                        //то он загружался, если убрать, то будет грузится также чужой профиль
                                        if (~this.props.history.location.pathname.indexOf('id')) this.props.history.goBack();
                                        this.props.onStoryChange({
                                            currentTarget: {
                                                dataset: {
                                                    story: 'LIKES',
                                                }
                                            }
                                        })
                                    }}
                                    selected={this.props.activeStory === 'LIKES'}
                                    data-story="LIKES"
                                >
                                    <Icon type={'LIKES'} isActive={this.props.activeStory === 'LIKES'}/>
                                </TabbarItem>
                                <TabbarItem
                                    onClick={() => {
                                        if (~this.props.history.location.pathname.indexOf('id')) this.props.history.goBack();
                                        this.props.onStoryChange({
                                            currentTarget: {
                                                dataset: {
                                                    story: 'IWANTLIKES',
                                                }
                                            }
                                        })
                                    }}
                                    selected={this.props.activeStory === 'IWANTLIKES'}
                                    data-story="IWANTLIKES"
                                >
                                    <Icon type={'IWANTLIKES'} isActive={this.props.activeStory === 'IWANTLIKES'}/>
                                </TabbarItem>
                                <TabbarItem
                                    onClick={() => {
                                        //данная проверка нужна чтобы когда юзер переходил с чужого профиля на свой
                                        //то он загружался, если убрать, то будет грузится также чужой профиль
                                        if (~this.props.history.location.pathname.indexOf('id')) {
                                            this.props.history.goBack();
                                        }
                                        this.props.onStoryChange({
                                            currentTarget: {
                                                dataset: {
                                                    story: 'PROFILE',
                                                }
                                            }
                                        })
                                    }}
                                    selected={this.props.activeStory === 'PROFILE'}
                                    data-story="PROFILE"
                                >
                                    <Icon type={'PROFILE'} isActive={this.props.activeStory === 'PROFILE'}/>
                                </TabbarItem>
                            </Tabbar>
                        }>


                            <View
                                id="TOP"
                                activePanel={this.state.epic.topView.activePanel}
                            >
                                <Panel id="TOP" centered={false}>
                                    <PanelHeader>Еженедельный топ</PanelHeader>
                                    {<Top/>}
                                </Panel>

                                <Panel id="PROFILE/ID">
                                    <PanelHeader
                                        left={
                                            <ButtonBack
                                                className='ButtonHeader-Back'
                                                onClick={() => {
                                                    this.props.history.goBack();
                                                }}
                                            >
                                            </ButtonBack>}
                                    >
                                        Профиль
                                    </PanelHeader>
                                    <Profile/>
                                </Panel>
                            </View>

                            <View
                                id="BATTLE"
                                activePanel={this.state.epic.battleView.activePanel}
                            >
                                <Panel id="BATTLE" centered={false} className={classes.Panel}>
                                    <PanelHeader
                                        left={
                                            <NavLink to="battle/filters">
                                                <ButtonFilter
                                                    className='ButtonHeader-Filter'
                                                >
                                                </ButtonFilter>
                                            </NavLink>
                                        }
                                    >
                                        Кого лайкнешь?
                                    </PanelHeader>

                                    <div className="OverAllWrapper-Content"
                                         style={{
                                             ...this.state.view,
                                             position: 'fixed',
                                             marginTop: `calc(${this.state.platform === IOS ? 44 : 56}px + env(safe-area-inset-top))`,
                                         }}
                                    >
                                        <Battle/>
                                    </div>
                                </Panel>

                                <Panel id="BATTLE/FILTERS" centered={false} className={classes.Panel}>
                                    <PanelHeader
                                        left={
                                            <ButtonBack
                                                className='ButtonHeader-Back'
                                                onClick={() => {
                                                    this.props.history.goBack();
                                                }}
                                            >
                                            </ButtonBack>}
                                    >
                                        Фильтры
                                    </PanelHeader>
                                    <div className="OverAllWrapper-Content"
                                         style={
                                             {
                                                 ...this.state.view,
                                                 background: "#fff",
                                             }
                                         }
                                    >
                                        <Filters/>
                                    </div>
                                </Panel>

                                <Panel id="BATTLE/CHOOSECITY" centered={false} className={classes.Panel}>
                                    <PanelHeader
                                        left={
                                            <ButtonBack
                                                className='ButtonHeader-Back'
                                                onClick={() => {
                                                    this.props.history.goBack();
                                                }}
                                            >
                                            </ButtonBack>}
                                    >
                                        Выбор города
                                    </PanelHeader>
                                    <div className="OverAllWrapper-Content"
                                         style={
                                             {
                                                 ...this.state.view,
                                                 background: "#fff",
                                             }
                                         }
                                    >
                                        <ChooseCity/>
                                    </div>
                                </Panel>

                                <Panel id="PROFILE/ID">
                                    <PanelHeader
                                        left={
                                            <ButtonBack
                                                className='ButtonHeader-Back'
                                                onClick={() => {
                                                    this.props.history.goBack();
                                                }}
                                            >
                                            </ButtonBack>}
                                    >
                                        Профиль
                                    </PanelHeader>
                                    <Profile/>
                                </Panel>
                            </View>

                            <View
                                id="LIKES"
                                activePanel={this.state.epic.likesView.activePanel}
                            >
                                <Panel id="LIKES" className={classes.Panel}>
                                    <PanelHeader>Меня лайкнули</PanelHeader>
                                    <Likes/>
                                </Panel>

                                <Panel id="PROFILE/ID">
                                    <PanelHeader
                                        left={
                                            <ButtonBack
                                                className='ButtonHeader-Back'
                                                onClick={() => {
                                                    this.props.history.goBack();
                                                }}
                                            >
                                            </ButtonBack>}
                                    >
                                        Профиль
                                    </PanelHeader>
                                    <Profile/>
                                </Panel>
                            </View>

                            <View
                                id="IWANTLIKES"
                                activePanel={this.state.epic.iWantLikesView.activePanel}
                            >
                                <Panel id="IWANTLIKES">
                                    <PanelHeader>Хочу лайки</PanelHeader>
                                    <IWantLikes/>
                                </Panel>

                                <Panel id="PROFILE/ID">
                                    <PanelHeader
                                        left={
                                            <ButtonBack
                                                className='ButtonHeader-Back'
                                                onClick={() => {
                                                    this.props.history.goBack();
                                                }}
                                            >
                                            </ButtonBack>}
                                    >
                                        Профиль
                                    </PanelHeader>
                                    <Profile/>
                                </Panel>
                            </View>

                            <View
                                id="PROFILE"
                                activePanel={this.state.epic.profileView.activePanel}
                            >
                                <Panel id="PROFILE">
                                    <PanelHeader
                                    >
                                        Профиль
                                    </PanelHeader>
                                    <Profile/>
                                </Panel>

                                <Panel id="PROFILE/ID">
                                    <PanelHeader
                                        left={
                                            <ButtonBack
                                                className='ButtonHeader-Back'
                                                onClick={() => {
                                                    this.props.history.goBack();
                                                }}
                                            >
                                            </ButtonBack>}
                                    >
                                        Профиль
                                    </PanelHeader>
                                    <Profile/>
                                </Panel>
                            </View>
                        </Epic>
                    </ConfigProvider>
                </div>
            </Swipeable>
        );
    }
}

function mapStateToProps(state) {
    return {
        online: state.online,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateOnline: (online) => dispatch(updateOnline(online))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Layout));
