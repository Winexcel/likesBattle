import React, { Component } from 'react';
import "./Profile.sass";
import { Switch, Group, Gallery } from '@vkontakte/vkui'; //здесь было подключение Gallery
import photo from '../../files/images/photos/1.jpg'
import CodoAPI from "../../services/CodoAPI/CodoAPI";
import { Link, withRouter } from "react-router-dom";
import PageNotFound from "../PageNotFound/PageNotFound";
import PopoutAboutAnonim from "../../components/UI/Popouts/PopoutAboutAnonim/PopoutAboutAnonim";
import PopoutWrapper from "../../components/UI/Popouts/PopoutWrapper/PopoutWrapper";
import { connect } from "react-redux";
import { filtersChangeAge, filtersChangePlace, filtersChangeSex } from "../../store/actions/filters";
import PopoutProfileIsAnonim from "../../components/UI/Popouts/PopoutProfileIsAnonim/PopoutProfileIsAnonim";
import ProfileIsPrivate from "../../components/ProfileIsPrivate/ProfileIsPrivate";
import PreloaderBig from "../../components/UI/PreloaderBig/PreloaderBig";
import { platform, IOS } from "@vkontakte/vkui/dist/vkui";
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css'
import LazyImage from "../../components/LazyImage/LazyImage";
import Preloader from "../../components/Preloader/Preloader";


class Profile extends Component {

    constructor(props) {
        super(props);

        this.galleryProfileRef = React.createRef();

        this.galleryLastClick = Date.now();

        this.params = {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 11,
            runCallbacksOnInit: true,
            rebuildOnUpdate: true,
            onInit: (swiper) => {
                alert('bb');
                this.swiper = swiper
            }
        };

        this.state = {
            isYourProfile: true,
            profile: {
                userId: undefined,
                isAnonim: false,
                listPhotos: [],
                offsetPhotos: 0,
                countPhotos: 3,
                photo100: '',
                firstName: '...',
                lastSeen: {
                    time: 0,
                    text: '...',
                },
                vk_id: null,
                age: 0,
            },
            gallery: {
                slideIndex: 0,
                likesOnCurrentPhoto: 0,
            },
            pageNotFound: false,
            showAboutAnonim: false,
            showProfileIsAnonim: false,
            showPreloader: true,
        }

        if (~this.props.history.location.pathname.indexOf('/id')) {
            this.state.isYourProfile = false;
        }
    }

    loadUser() {
        let userId = undefined;
        if (~this.props.history.location.pathname.indexOf('/id')) {
            userId = this.props.history.location.pathname.slice(this.props.history.location.pathname.indexOf('/id') + 3);
        }
        if (userId != this.state.profile.userId || this.state.profile.firstName == '...') {
            CodoAPI.backend.user.getInfo(userId).then(data => {
                CodoAPI.backend.photos.getAll(userId).then(photos => {
                    let profile = { ...this.state.profile };
                    let gallery = { ...this.state.gallery };
                    if (data.response) {
                        profile.userId = userId;
                        profile.firstName = data.response.first_name;
                        profile.photo100 = data.response.photo_100;
                        if (photos.response && photos.response.items && photos.response.items.length > 0) {
                            profile.listPhotos = [...photos.response.items];
                            gallery.likesOnCurrentPhoto = profile.listPhotos[0].likes.count;
                        }
                        profile.lastSeen = data.response.last_seen;
                        profile.sex = data.response.sex;
                        profile.isAnonim = data.response.is_anonim;
                        profile.ownLikes = data.response.own_likes;
                        profile.usersLikes = data.response.users_likes;
                        profile.age = data.response.age;
                        if (!data.response.is_anonim)
                            profile.vkId = data.response.vk_id;
                        this.setState({
                            profile,
                            gallery,
                            showPreloader: false,
                        })
                    } else {
                        this.setState({ pageNotFound: true, showPreloader: false });
                    }
                })
            })
        }
    }

    loadPhotos() {
        let userId = undefined;
        if (~this.props.history.location.pathname.indexOf('/id')) {
            userId = this.props.history.location.pathname.slice(this.props.history.location.pathname.indexOf('/id') + 3);
        }
        CodoAPI.backend.photos.getAll(userId).then(photos => {
            let profile = { ...this.state.profile };
            if (photos.response && photos.response.items) profile.listPhotos = [...photos.response.items];

            this.setState({
                profile,
            })
        })
    }


    componentDidMount() {
        this.loadUser();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.pageNotFound) this.loadUser();

        if (this.galleryProfileRef.current) this.galleryProfileRef.current.addEventListener('touchmove', this.blockSwipeBack);
    }

    componentWillUnmount() {
        if (this.galleryProfileRef.current) this.galleryProfileRef.current.removeEventListener('touchmove', this.blockSwipeBack);
    }

    blockSwipeBack(event) {
        event.stopPropagation();
    }

    render() {
        const TabBarHeight = 70;
        const listPhotos = this.state.profile.listPhotos.slice(0, this.state.profile.countPhotos);

        // добавляем пустые слайды для фикса бага https://github.com/VKCOM/VKUI/issues/449
        listPhotos.push({ isEmptySlide: true });

        // TODO: view нужно передавать из Layout, недопустимо объявлять несколько раз view, например можно сделать через
        // глобальный контекст
        return (
            <div
                className={ 'Profile' }
                style={ this.state.showPreloader
                    ? {
                        display: 'flex',
                        position: 'relative',
                        height: 'calc(100vh - (' + ( platform() == IOS ? 44 : 56 ) + 'px + ' + TabBarHeight + 'px + env(safe-area-inset-bottom) + env(safe-area-inset-top)))',
                        boxSizing: 'border-box',
                    }
                    : null
                }
            >
                {
                    !this.state.showPreloader
                        ? <>
                            {
                                this.state.showAboutAnonim
                                    ? <PopoutWrapper onBackDropClick={ () => {
                                        this.setState({ showAboutAnonim: false });
                                    } }>
                                        <PopoutAboutAnonim
                                            onPopoutClose={ () => {
                                                this.setState({ showAboutAnonim: false });
                                            } }
                                            onClick={ () => {
                                                this.setState({ showAboutAnonim: false });
                                            } }/>
                                    </PopoutWrapper>
                                    : null
                            }

                            {
                                this.state.showProfileIsAnonim
                                    ? <PopoutWrapper onBackDropClick={ () => {
                                        this.setState({ showProfileIsAnonim: false });
                                    } }>
                                        <PopoutProfileIsAnonim
                                            onPopoutClose={ () => {
                                                this.setState({ showProfileIsAnonim: false });
                                            } }
                                            onClick={ () => {
                                                this.setState({ showProfileIsAnonim: false });
                                            } }/>
                                    </PopoutWrapper>
                                    : null
                            }

                            {
                                this.state.pageNotFound
                                    ? <PageNotFound/>
                                    : <>
                                        <div className="Profile-Row Profile-Overall">
                                            <div className="Profile-Avatar">
                                                <img className="Profile-AvatarImg"
                                                     src={ this.state.profile.photo100 } alt=""/>
                                            </div>
                                            <div className="Profile-Info">
                                                <div
                                                    className="Profile-Name">{ this.state.profile.firstName }</div>
                                                <div
                                                    className="Profile-Status">{ this.state.isYourProfile ? 'Это ты' : ( this.state.profile.lastSeen.time != 0 ? ( ( this.state.profile.sex == 1 ? 'Была ' : 'Был ' ) + this.state.profile.lastSeen.text ) : this.state.profile.lastSeen.text ) }</div>
                                                <div className="Profile-Button">
                                                    <div
                                                        className={ 'Profile-Tumbler' + ( this.state.isYourProfile ? '' : ' Profile-TumblerNoPadding' ) }
                                                        onClick={ () => {
                                                            if (!this.state.isYourProfile) {

                                                            }
                                                        } }
                                                    >
                                                        {
                                                            this.state.isYourProfile
                                                                ? <>
                                                                    <span className="Profile-TumblerText"
                                                                          onClick={ () => {
                                                                              this.setState({ showAboutAnonim: true });
                                                                          } }
                                                                    >Скрывать ВК</span>
                                                                    <div
                                                                        style={ {
                                                                            display: 'inline-block',
                                                                            background: '#F3F3F3',
                                                                            fontSize: '10px',
                                                                            width: '13px',
                                                                            height: '13px',
                                                                            textAlign: 'center',
                                                                            lineHeight: '13px',
                                                                            borderRadius: '50%',
                                                                            color: '#575757',
                                                                            fontWeight: 500,
                                                                            transform: 'translate(2px,-5px)',
                                                                            boxSizing: 'border-box',
                                                                            paddingTop: ( CodoAPI.clientInfo.platform == 'android' || CodoAPI.clientInfo.platform == 'ios' ) ? '1px' : '0px',
                                                                        } }
                                                                    >
                                                                        ?
                                                                    </div>
                                                                    {
                                                                        this.state.profile.age < 18
                                                                            ? <div
                                                                                className="Profile-TumblerAboutAnonim"
                                                                                onClick={ () => {
                                                                                    this.setState({ showAboutAnonim: true });
                                                                                } }
                                                                            />
                                                                            : null
                                                                    }
                                                                    <Switch
                                                                        className="Profile-TumblerSwitcher"
                                                                        checked={ this.state.profile.isAnonim }
                                                                        disabled={ this.state.profile.age < 18 ? true : false }

                                                                        onChange={ () => {
                                                                            let profile = { ...this.state.profile };
                                                                            profile.isAnonim = !profile.isAnonim;
                                                                            CodoAPI.backend.user.setSettings({ isAnonim: profile.isAnonim }).then(() => {
                                                                                CodoAPI.backend.user.getInfo().then(data => {
                                                                                    profile.isAnonim = data.response.is_anonim;
                                                                                    this.setState({
                                                                                        profile,
                                                                                    })
                                                                                })

                                                                            })
                                                                        } }
                                                                    />
                                                                </>
                                                                : ( this.state.profile.isAnonim
                                                                ? <button
                                                                    className="ButtonWithIcon ButtonGoVK ButtonAnonim Profile-ButtonGoVK"
                                                                    onClick={ () => {
                                                                        this.setState({
                                                                            showProfileIsAnonim: true,
                                                                        })
                                                                    } }
                                                                >
                                                                    Аноним
                                                                </button>
                                                                : <a href={ 'https://vk.com/id' + this.state.profile.vkId }
                                                                     target="_blank"
                                                                     style={ {
                                                                         width: '100%'
                                                                     } }
                                                                >
                                                                    <button
                                                                        className="ButtonWithIcon ButtonGoVK Profile-ButtonGoVK"
                                                                    >
                                                                        Перейти
                                                                    </button>
                                                                </a> )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Profile-Row">
                                            <div className="Profile-Stats Stats">
                                                <div className="Stats-Item">
                                                    <div
                                                        className="Stats-ItemCount">{ this.state.profile.listPhotos.length }</div>
                                                    <div className="Stats-ItemText">Фото</div>
                                                </div>
                                                <div className="Stats-Item">
                                                    <div className="Stats-ItemCount">{ this.state.profile.ownLikes }</div>
                                                    <div className="Stats-ItemText">Монет</div>
                                                </div>
                                                <div className="Stats-Item">
                                                    <div className="Stats-ItemCount">{ this.state.profile.usersLikes }</div>
                                                    <div className="Stats-ItemText">Лайков</div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            this.state.profile.listPhotos.length > 0
                                                ? <div
                                                    className="Profile-Gallery"
                                                    style={ { width: '100vw' } }
                                                    ref={ this.galleryProfileRef }
                                                >
                                                    <Gallery
                                                        slideWidth="40vh"
                                                        align="center"
                                                        style={ { height: '40vh', overflow: 'hidden' } }
                                                        slideIndex={ this.state.gallery.slideIndex }
                                                        onChange={ (targetIndex) => {
                                                            const gallery = { ...this.state.gallery };
                                                            gallery.slideIndex = targetIndex;
                                                            this.setState({ gallery });
                                                        } }
                                                        onEnd={ (event) => {
                                                            if (!listPhotos[event.targetIndex].isEmptySlide) {
                                                                let profile = { ...this.state.profile };
                                                                profile.listPhotos = [...this.state.profile.listPhotos];
                                                                let gallery = { ...this.state.gallery };
                                                                gallery.slideIndex = event.targetIndex;
                                                                profile.countPhotos += 3;
                                                                gallery.likesOnCurrentPhoto = profile.listPhotos[event.targetIndex].likes.count;

                                                                this.setState({
                                                                    profile,
                                                                    gallery,
                                                                })
                                                            } else {
                                                                let profile = { ...this.state.profile };
                                                                profile.listPhotos = [...this.state.profile.listPhotos];
                                                                let gallery = { ...this.state.gallery };

                                                                //поиск последнего не пустого слайда
                                                                let lastIndex = 0;
                                                                for (let i = 0; i < profile.listPhotos.length; i++) {
                                                                    lastIndex = i;
                                                                    if (profile.listPhotos[i].isEmptySlide) {
                                                                        lastIndex = lastIndex - 1;
                                                                        break;
                                                                    }
                                                                }

                                                                gallery.slideIndex = lastIndex;
                                                                profile.countPhotos += 3;
                                                                gallery.likesOnCurrentPhoto = profile.listPhotos[lastIndex].likes.count;

                                                                this.setState({
                                                                    profile,
                                                                    gallery,
                                                                })
                                                            }
                                                        } }
                                                    >
                                                        {
                                                            listPhotos.map((item, i) => {
                                                                // Добавляем пустые контейнеры для фикса бага со свайпом https://github.com/VKCOM/VKUI/issues/449
                                                                if (item.isEmptySlide) {
                                                                    return <div
                                                                        key={ item.photo + i }
                                                                        className="Gallery-Container"
                                                                    />
                                                                }

                                                                return this.state.profile.countPhotos > i
                                                                    ? <div key={ item.photo + i } className="Gallery-Container">
                                                                        <LazyImage
                                                                            style={ { objectFit: 'cover' } }
                                                                            src={ item.photo }
                                                                            alt=""
                                                                            loader={ <Preloader/> }
                                                                            error={ <div className="Gallery-ImgError"/> }
                                                                            onClick={ () => {
                                                                                // фикс бага с двойным открытием фотографии
                                                                                if (( Date.now() - this.galleryLastClick ) > 1000) {
                                                                                    this.galleryLastClick = Date.now();
                                                                                    CodoAPI.VKAPI.showImages([item.photo_big]);
                                                                                }
                                                                            } }
                                                                        />
                                                                        {/*<img
                                                                            style={ { objectFit: 'cover' } }
                                                                            src={ item.photo }
                                                                            alt=""
                                                                            onClick={ () => {
                                                                                // фикс бага с двойным открытием фотографии
                                                                                if (( Date.now() - this.galleryLastClick ) > 1000) {
                                                                                    this.galleryLastClick = Date.now();
                                                                                    CodoAPI.VKAPI.showImages([item.photo]);
                                                                                }
                                                                            } }
                                                                        />*/ }

                                                                        <div
                                                                            style={ {
                                                                                //position: 'absolute',
                                                                                height: '50px',
                                                                                width: '0px',
                                                                                bottom: '26px',
                                                                                right: '26px',
                                                                            } }
                                                                        >
                                                                            {
                                                                                item.likes.user_likes == 1
                                                                                    ? <button
                                                                                        className="BattleUser-Like BattleUser-Liked"
                                                                                        onClick={ () => {
                                                                                            let profile = { ...this.state.profile };
                                                                                            let gallery = { ...this.state.gallery };

                                                                                            for (let i = 0; i < profile.listPhotos.length; i++) {
                                                                                                if (profile.listPhotos[i].photo_id == item.photo_id) {
                                                                                                    profile.listPhotos[i].likes.user_likes = 0;
                                                                                                    profile.listPhotos[i].likes.count--;
                                                                                                    gallery.likesOnCurrentPhoto = profile.listPhotos[i].likes.count;
                                                                                                    break;
                                                                                                }
                                                                                            }

                                                                                            this.setState({
                                                                                                profile,
                                                                                                gallery,
                                                                                            });

                                                                                            CodoAPI.backend.likes.delete(item.user_id, item.photo_id);
                                                                                        } }
                                                                                    />
                                                                                    : <button
                                                                                        className="BattleUser-Like"
                                                                                        onClick={ () => {
                                                                                            let profile = { ...this.state.profile };
                                                                                            let gallery = { ...this.state.gallery };

                                                                                            for (let i = 0; i < profile.listPhotos.length; i++) {
                                                                                                if (profile.listPhotos[i].photo_id == item.photo_id) {
                                                                                                    profile.listPhotos[i].likes.user_likes = 1;
                                                                                                    profile.listPhotos[i].likes.count++;
                                                                                                    gallery.likesOnCurrentPhoto = profile.listPhotos[i].likes.count;
                                                                                                    break;
                                                                                                }
                                                                                            }

                                                                                            this.setState({
                                                                                                profile,
                                                                                                gallery,
                                                                                            });

                                                                                            CodoAPI.backend.likes.add(item.user_id, item.photo_id);
                                                                                        } }
                                                                                    />
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    : null
                                                            })
                                                        }
                                                    </Gallery>

                                                    <div className="Gallery-PhotoInfo PhotoInfo">
                                                        <span className="PhotoInfo-Text"> Фотографию оценили:</span>
                                                        <span className="PhotoInfo-Count">
                                                            { this.state.gallery.likesOnCurrentPhoto }
                                                            </span>
                                                    </div>
                                                </div>
                                                : <ProfileIsPrivate className="Profile-ProfileIsPrivate"/>
                                        }
                                    </>
                            }
                        </>
                        : <PreloaderBig className="Profile-PreloaderBig"/>
                }
            </div>
        );
    }
}


export default connect()(withRouter(Profile));
