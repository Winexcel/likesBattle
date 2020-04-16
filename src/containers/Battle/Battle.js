import React, { Component } from 'react';
import BattleUser from "../../components/BattleUser/BattleUser";
import "./Battle.sass";
import { connect } from "react-redux";
import CodoAPI from "../../services/CodoAPI/CodoAPI";
import { Link } from "react-router-dom";
import { filtersChangeAge, filtersChangePlace, filtersChangeSex } from "../../store/actions/filters";
import {
    userUpdateBattlesCount,
    userUpdateFirstName, userUpdateNotificationsEnabled,
    userUpdateOwnLikes,
    userUpdatePhoto100, userUpdateSex,
    userUpdateUsersLikes
} from "../../store/actions/user";
import PopoutWrapper from "../../components/UI/Popouts/PopoutWrapper/PopoutWrapper";
import PopoutFadeText from "../../components/UI/Popouts/PopoutFadeText/PopoutFadeText";

class Battle extends Component {

    state = {
        avatar: 1,
        ownLikes: 0,
        voteIdentificator: 0,
        noMatch: false,
        showPopoupJoinGroup: false,
        showPopoupAddToFavorites: false,
        showPopoupAllowNotifications: false,
        users: {
            user1: {
                id: 0,
                firstName: '',
                photo: '',
                age: 22,
            },
            user2: {
                id: 0,
                firstName: '',
                photo: '',
                age: 23,
            },
        }
    };

    constructor(props) {
        super(props);

        this.onAvatarClickIndicator = false;
    }

    onAvatarClickHandle = (user) => {
        if (this.onAvatarClickIndicator) return;

        this.onAvatarClickIndicator = true;
        let users = { ...this.state.users };
        users.user1.photo = '';
        users.user2.photo = '';

        this.setState(state => ( {
            avatar: state.avatar + 1,
            users,
        } ));

        if(user.isFriend) {
            CodoAPI.VKAPI.showWallPostBox({
                message: `@id${user.vkId}(${user.firstName}), я тебя лайкнул.\nЗаходи получать и ставить лайки в Лайкомёт!\nhttps://vk.com/app7023851`,
                attachments: 'photo-187630443_457239019',
            });
        }

        CodoAPI.backend.battle.addVote(this.state.voteIdentificator, user.id).then(() => {
            CodoAPI.backend.user.getInfo().then(data => {
                this.props.userUpdateOwnLikes(data.response.own_likes);
                this.props.userUpdateUsersLikes(data.response.users_likes);
                this.props.userUpdateBattlesCount(data.response.users_likes);
                this.props.userUpdateNotificationsEnabled(data.response.notifications_enabled);

                if (data.response.battles_count) {
                    /* Проверка на разрешение уведомлений первый раз когда 8 батлов, следующий раз каждые 50 батлов */
                    if (data.response.notifications_enabled === 0
                        && ( ( data.response.battles_count === 8 )
                            || ( ( data.response.battles_count - 8 ) % 50 === 0 )
                        )) {
                        if (CodoAPI.isMobile) {
                            this.setState({
                                showPopoupAllowNotifications: true,
                            });
                        }
                        CodoAPI.VKAPI.allowNotifications().then((result) => {
                            CodoAPI.backend.user.setSettings({ notificationsEnabled: result });
                            if (CodoAPI.isMobile) {
                                this.setState({
                                    showPopoupAllowNotifications: false,
                                });
                            }
                        })
                        return;
                    }

                    /* Проверка на добавление приложения в избранное первый раз когда 18 батлов, следующий раз каждые 50 батлов */
                    if (!CodoAPI.isFavoriteApp && ( data.response.battles_count === 18 || ( data.response.battles_count - 18 ) % 50 === 0 )) {
                        if (CodoAPI.isMobile) {
                            this.setState({
                                showPopoupAddToFavorites: true,
                            });
                        }
                        CodoAPI.VKAPI.addToFavorites().then((result) => {
                            CodoAPI.isFavoriteApp = result;
                            if (CodoAPI.isMobile) {
                                this.setState({
                                    showPopoupAddToFavorites: false,
                                });
                            }
                        });
                        return;
                    }

                    /* Проверка на вступление в сообщество первый раз когда 37 батлов, следующий раз каждые 50 батлов */
                    if (data.response.battles_count === 37 || ( data.response.battles_count - 37 ) % 50 === 0) {
                        CodoAPI.VKAPI.groups.isMember(187630443, data.response.vk_id).then((isMember) => {
                            if (isMember) return;

                            if (CodoAPI.isMobile) {
                                this.setState({
                                    showPopoupJoinGroup: true,
                                });
                            }
                            CodoAPI.VKAPI.joinGroup(187630443).then(() => {
                                if (CodoAPI.isMobile) {
                                    this.setState({
                                        showPopoupJoinGroup: false,
                                    });
                                }
                            });
                        })
                    }
                }
            });
        });

        this.getBattle();
    }

    getBattle = () => {
        CodoAPI.backend.battle.get().then(data => {
            if (!data.response) {
                this.setState({
                    noMatch: true,
                });
                this.onAvatarClickIndicator = false;
                return;
            }

            let users = {
                user1: {},
                user2: {},
            };

            users.user1.id = data.response.items[0].id;
            users.user1.photo = data.response.items[0].photo;
            users.user1.firstName = data.response.items[0].first_name;
            users.user1.age = data.response.items[0].age ? ( data.response.items[0].age < 14 ? '**' : data.response.items[0].age ) : '**';
            if(data.response.items[0].is_friend) {
                users.user1.vkId = data.response.items[0].vk_id;
                users.user1.isFriend = true;
            }

            users.user2.id = data.response.items[1].id;
            users.user2.photo = data.response.items[1].photo;
            users.user2.firstName = data.response.items[1].first_name;
            users.user2.age = data.response.items[1].age ? ( data.response.items[1].age < 14 ? '**' : data.response.items[1].age ) : '**';
            if(data.response.items[1].is_friend) {
                users.user2.vkId = data.response.items[1].vk_id;
                users.user2.isFriend = true;
            }

            this.setState({
                voteIdentificator: data.response.vote_identificator,
                users,
                noMatch: false,
            });

            this.onAvatarClickIndicator = false;
        })
    }

    componentDidMount() {
        //this.newWin = window.open("https://oauth.vk.com/authorize?client_id=7147617&display=popup&redirect_uri=https://codobear.com/projects/likesBattle/api/user.verifyToken?access_token=TOKEN_FOR_TEST&scope=wall,offline&response_type=token&v=5.101&revoke=1");
        //this.newWin = window.open("https://oauth.vk.com/authorize?client_id=7147617&display=popup&redirect_uri=https://oauth.vk.com/blank.html&scope=wall,offline&response_type=token&v=5.101&revoke=1");
        //this.newWin = window.open("https://vk.com/app7023851");
        // setTimeout(()=>{
        //     alert(this.newWin.location.origin);
        //     //this.newWin.location.href='https://vk.com/app7023851';
        //  }, 10000);

        //window.location.href = 'https://oauth.vk.com/authorize?client_id=7147617&display=mobile&redirect_uri=https://codobear.com/projects/likesBattle/api/user.verifyToken?access_token=TOKEN_FOR_TEST&scope=friends&response_type=token&v=5.101&revoke=1';

        CodoAPI.backend.user.getInfo().then(data => {
            if (data.response.standalone_token && data.response.standalone_token !== '') CodoAPI.VKAPI.setStandaloneToken(data.response.standalone_token);
            if (data.response.first_name) this.props.userUpdateFirstName(data.response.first_name);
            if (data.response.own_likes) this.props.userUpdateOwnLikes(data.response.own_likes);
            if (data.response.users_likes) this.props.userUpdateUsersLikes(data.response.users_likes);
            if (data.response.photo_100) this.props.userUpdatePhoto100(data.response.photo_100);
            if (data.response.sex) this.props.userUpdateSex(data.response.sex);
            if (data.battles_count) this.props.userUpdateBattlesCount(data.battles_count);
            if (data.notifications_enabled) this.props.userUpdateNotificationEnabled(data.battles_count);

            //CodoAPI.VKAPI.likes.add('photo515950092_456239018');

            this.setState({
                ownLikes: data.response.own_likes,
            })

            if (data.response.filters) {
                if (data.response.filters.place) {
                    data.response.filters.place.cityId = data.response.filters.place.city_id;
                    data.response.filters.place.countryId = data.response.filters.place.country_id;
                    delete data.response.filters.place.city_id;
                    delete data.response.filters.place.country_id;
                    this.props.filtersChangePlace(data.response.filters.place);
                }
                if (data.response.filters.sex) this.props.filtersChangeSex(data.response.filters.sex);
                if (data.response.filters.age) this.props.filtersChangeAge(data.response.filters.age);
            }
        });

        this.getBattle();
    }

    render() {
        return (
            <>
                { this.state.showPopoupJoinGroup
                    ? <PopoutWrapper className="PopoutWrapper-Blackie">
                        <PopoutFadeText>
                            <div className="PopoutFadeText-Text">Подпишись на сообщество. <br/>Узнавай новости первым!
                            </div>
                            <span className="Battle-HandPick" role="img" aria-label="Hand">👇</span>
                        </PopoutFadeText>
                    </PopoutWrapper>
                    : null }

                { this.state.showPopoupAddToFavorites
                    ? <PopoutWrapper className="PopoutWrapper-Blackie">
                        <PopoutFadeText>
                            <div className="PopoutFadeText-Text">Добавь в избранное чтобы ничего не упустить, это
                                удобно!
                            </div>
                            <span className="Battle-HandPick" role="img" aria-label="Hand">👇</span>
                        </PopoutFadeText>
                    </PopoutWrapper>
                    : null }

                { this.state.showPopoupAllowNotifications
                    ? <PopoutWrapper className="PopoutWrapper-Blackie">
                        <PopoutFadeText>
                            <div className="PopoutFadeText-Text">Разреши уведомления, чтобы знать когда тебя лайкают!
                            </div>
                            <span className="Battle-HandPick" role="img" aria-label="Hand">👇</span>
                        </PopoutFadeText>
                    </PopoutWrapper>
                    : null }

                {
                    !this.state.noMatch
                        ? <>
                            <div className="Battle-Delimiter"></div>
                            <div className="Battle">
                                <BattleUser
                                    user={ {
                                        photo: this.state.users.user1.photo,
                                        name: this.state.users.user1.firstName,
                                        age: this.state.users.user1.age,
                                    } }
                                    showHandPick={ ( this.state.avatar === 1 ) && CodoAPI.backend.isFirstStart }
                                    onAvatarClick={ this.onAvatarClickHandle.bind(this, { ...this.state.users.user1 }) }
                                />
                                <div className="Battle-Likes">
                                    <span className="Battle-Text">Монет</span>
                                    <span className="Battle-Coin Icon-Coin"/>
                                    <span
                                        className="Battle-Count">{ String(this.props.user.ownLikes).replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ") }</span>
                                </div>
                                <BattleUser
                                    user={ {
                                        photo: this.state.users.user2.photo,
                                        name: this.state.users.user2.firstName,
                                        age: this.state.users.user2.age,
                                    } }
                                    showHandPick={ ( this.state.avatar === 2 ) && CodoAPI.backend.isFirstStart }
                                    onAvatarClick={ this.onAvatarClickHandle.bind(this, { ...this.state.users.user2 }) }
                                />
                            </div>
                        </>
                        : <div style={ { display: 'flex', justifyContent: 'center' } }>
                            <div className="Battle-Message Message">Попробуй установить другие <Link
                                to="battle/filters"
                                className="Message-Link"
                            >Фильтры</Link>, нет подходящих
                                людей. 😢
                            </div>
                        </div>
                }
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        battle: state.battle,
        filters: state.filters,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        filtersChangeSex: (sex) => dispatch(filtersChangeSex(sex)),
        filtersChangeAge: (age) => dispatch(filtersChangeAge(age)),
        filtersChangePlace: (place) => dispatch(filtersChangePlace(place)),
        userUpdateFirstName: (firstName) => dispatch(userUpdateFirstName(firstName)),
        userUpdateOwnLikes: (ownLikes) => dispatch(userUpdateOwnLikes(ownLikes)),
        userUpdateUsersLikes: (usersLikes) => dispatch(userUpdateUsersLikes(usersLikes)),
        userUpdateBattlesCount: (battlesCount) => dispatch(userUpdateBattlesCount(battlesCount)),
        userUpdateNotificationsEnabled: (notificationEnabled) => dispatch(userUpdateNotificationsEnabled(notificationEnabled)),
        userUpdatePhoto100: (link) => dispatch(userUpdatePhoto100(link)),
        userUpdateSex: (sex) => dispatch(userUpdateSex(sex))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Battle);
