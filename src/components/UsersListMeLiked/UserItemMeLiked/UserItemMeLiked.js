import React, { useState } from "react";
import "./UserItemMeLiked.sass";
import photo from "../../../files/images/photos/2.jpg";
import { Link } from "react-router-dom";
import PopoutWrapper from "../../UI/Popouts/PopoutWrapper/PopoutWrapper";
import PopoutOpenLink from "../../UI/Popouts/PopoutOpenLink/PopoutOpenLink";
import CodoAPI from "../../../services/CodoAPI/CodoAPI";
import { GlobalContext } from "../../../App";
import PopoutNoLikes from "../../UI/Popouts/PopoutNoLikes/PopoutNoLikes";
import LazyImage from "../../LazyImage/LazyImage";
import Preloader from "../../Preloader/Preloader";


const UserItemMeLiked = (props) => {
    const [showPopout, setShowPopout] = useState(false);
    const [imageLastClick, setImageLastClick] = useState(0);

    return (
        <li className={ 'UserItemMeLiked ' + ( props.className ? props.className : '' ) }>
            {
                showPopout
                    ? <PopoutWrapper onBackDropClick={ () => {
                        setShowPopout(!showPopout)
                    } }>
                        {
                            props.ownLikes >= 50
                                ? <PopoutOpenLink
                                    onPopoutClose={ () => {
                                        setShowPopout(!showPopout)
                                    } }
                                    onOpenUser={ () => {
                                        CodoAPI.backend.user.openUser(props.user).then(() => {
                                            setShowPopout(!showPopout);
                                            props.onOpenUser();
                                        });
                                    } }
                                    user={ props.user }
                                />
                                : <GlobalContext.Consumer>
                                    { value => (
                                        <PopoutNoLikes
                                            // firstName={ this.props.user.firstName }
                                            onPopoutClose={ () => setShowPopout(!showPopout) }
                                            onClick={ value.popoutNoLikesClickHandle }
                                        />
                                    ) }
                                </GlobalContext.Consumer>
                        }
                    </PopoutWrapper>
                    : null
            }

            <Link
                className="UserItemMeLiked-AvatarLink"
                to={ props.user.id ? '/id' + props.user.id : '#' }
                onClick={ props.user.id ? null : () => {
                    setShowPopout(true);
                } }
            >
                <LazyImage
                    className="UserItemMeLiked-Avatar"
                    src={ props.user.photo }
                    alt=""
                    loader={ <Preloader className="UserItemMeLiked-Avatar UserItemMeLiked-Preloader"/> }
                    error={ <div className="UserItemMeLiked-Avatar UserItemMeLiked-AvatarError"/> }
                />

                {/*<img className="UserItemMeLiked-Avatar" src={ props.user.photo } alt=""/>*/ }
                { props.user.id ? null : <i className="UserItemMeLiked-AvatarUnlock"/> }
            </Link>
            <div className="UserItemMeLiked-Info">
                <Link
                    className="UserItemMeLiked-NameLink"
                    to={ props.user.id ? '/id' + props.user.id : '#' }
                    onClick={ props.user.id ? null : () => {
                        setShowPopout(true);
                    } }
                >
                    <span className="UserItemMeLiked-Name">{ props.user.firstName }</span><i
                    className="UserItemMeLiked-NameArrow"/>
                </Link>
                <span className="UserItemMeLiked-AdditionalInfo">
                    {
                        props.user.voteIdentificator
                            ? ( props.user.sex === 1 ? 'Оценила' : 'Оценил' ) + ' тебя в батле'
                            : null
                    }
                    {
                        props.user.likeIdentificator
                            ? ( props.user.sex === 1 ? 'Лайкнула' : 'Лайкнул' ) + ' твоё фото'
                            : null
                    }

                </span>
                <span className="UserItemMeLiked-Time">{ props.user.info }</span>
            </div>
            <div className="UserItemMeLiked-InfoContainer">
                {
                    props.user.likeIdentificator
                        ? <img
                            className="OneImage"
                            src={ props.user.likedPhoto }
                            alt=""
                            onClick={ () => {
                                if (( Date.now() - imageLastClick ) > 1000) {
                                    setImageLastClick(Date.now());
                                    CodoAPI.VKAPI.showImages([
                                        props.user.likedPhotoBig,
                                    ]);
                                }
                            } }
                        />
                        : null
                }
                {
                    props.user.voteIdentificator
                        ? <>
                            <div className="TwoImages"
                                 onClick={ () => {
                                     if (( Date.now() - imageLastClick ) > 1000) {
                                         setImageLastClick(Date.now());
                                         CodoAPI.VKAPI.showImages([
                                             props.user.user1PhotoBig,
                                             props.user.user2PhotoBig,
                                         ]);
                                     }
                                 } }
                            >
                                <LazyImage
                                    className="TwoImages-One"
                                    src={ props.user.user1Photo }
                                    alt=""
                                    loader={ <Preloader
                                        className="TwoImages-One UserItemMeLiked-Preloader"
                                        style={ {
                                            position: 'relative',
                                            left: '25px',
                                            zIndex: 2,
                                        } }
                                    /> }
                                    error={ <div className="TwoImages-One UserItemMeLiked-AvatarError"/> }
                                />
                                <LazyImage
                                    className="TwoImages-Two"
                                    src={ props.user.user2Photo }
                                    alt=""
                                    loader={ <Preloader
                                        className="TwoImages-Two UserItemMeLiked-Preloader"
                                    /> }
                                    error={ <div className="TwoImages-Two UserItemMeLiked-AvatarError"/> }
                                />

                                {/*<img className="TwoImages-One" src={ props.user.user1Photo } alt=""/>*/ }
                                {/*<img className="TwoImages-Two" src={ props.user.user2Photo } alt=""/>*/ }
                            </div>
                        </>
                        : null
                }
            </div>
        </li>
    )
}

export default UserItemMeLiked;
