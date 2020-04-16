import React from "react";
import "./UserItem.sass";
import ButtonWithIcon from "../../UI/Buttons/ButtonWithIcon/ButtonWithIcon";
import LazyImage from "../../LazyImage/LazyImage";
import Preloader from "../../Preloader/Preloader";
import "./UserItem.sass";
import PopoutWrapper from "../../UI/Popouts/PopoutWrapper/PopoutWrapper";
import PopoutNoLikes from "../../UI/Popouts/PopoutNoLikes/PopoutNoLikes";
import PopoutOpenLink from "../../UI/Popouts/PopoutOpenLink/PopoutOpenLink";
import { GlobalContext } from "../../../App";
import CodoAPI from "../../../services/CodoAPI/CodoAPI";
import { Link } from "react-router-dom";


class UserItem extends React.Component {

    state = {
        showPopout: false,
    }

    onClickHandle = () => {
        this.setState((props, state) => ( {
            showPopout: !state.showPopout,
        } ));
    }

    handleBackDropClick = (event) => {
        this.setState({
            showPopout: false,
        })
    }

    handlePopoutOpenLinkClose = (event) => {
        this.setState({
            showPopout: false,
        })
    }

    render() {
        return ( <>
                {/* Deprecated popout and need to be deleted */ }
                {
                    this.state.showPopout
                        ? <PopoutWrapper onBackDropClick={ this.handleBackDropClick }>
                            {
                                this.props.ownLikes >= 50
                                    ? <PopoutOpenLink
                                        onPopoutClose={ this.handlePopoutOpenLinkClose }
                                        onOpenUser={ () => {
                                            CodoAPI.backend.user.openUser(this.props.user.voteIdentificator).then(() => {
                                                this.handlePopoutOpenLinkClose();
                                                this.props.onOpenUser();
                                            });
                                        } }
                                        user={ this.props.user }
                                    />
                                    : <GlobalContext.Consumer>
                                        { value => (
                                            <PopoutNoLikes
                                                // firstName={ this.props.user.firstName }
                                                onPopoutClose={ this.handlePopoutOpenLinkClose }
                                                onClick={ value.popoutNoLikesClickHandle }
                                            />
                                        ) }
                                    </GlobalContext.Consumer>
                            }
                        </PopoutWrapper>
                        : null
                }

                {
                    this.props.counted
                        ? <div className="UserItem-Number">{ this.props.counter }</div>
                        : null
                }
                <Link to={ this.props.user.id ? '/id' + this.props.user.id : '#' }
                      onClick={ this.props.user.id ? null : this.onClickHandle }
                >
                    <LazyImage
                        className="UserItem-Avatar"
                        src={ this.props.user.photo }
                        alt="User avatar"
                        loader={ <Preloader className="UserItem-Avatar UserItem-AvatarPreloader"/> }
                        error={ <div className="UserItem-Avatar UserItem-AvatarError"/> }
                        onAfterLoading={ () => {
                            if (this.props.onAfterLoading) this.props.onAfterLoading();
                        } }
                        onLoadingError={ () => {
                            if (this.props.onAfterLoading) this.props.onAfterLoading();
                        } }
                    />
                </Link>

                <div className="UserItem-Info">
                    <span className="UserItem-Name">{ this.props.user.firstName }</span>
                    <span className="UserItem-AdditionalInfo">{ this.props.user.info }</span>
                </div>
                {
                    this.props.user.id
                        ? <div className="UserItem-ButtonWrapper">
                            <Link to={ '/id' + this.props.user.id }>
                                <ButtonWithIcon
                                    className="UserItem-ButtonGo ButtonGo"
                                >
                                    Перейти
                                </ButtonWithIcon>
                            </Link>
                        </div>
                        : <div className="UserItem-ButtonWrapper">
                            <ButtonWithIcon className="UserItem-ButtonOpen ButtonOpen"
                                            onClick={ this.onClickHandle }>Открыть</ButtonWithIcon>
                        </div>
                }
            </>
        )
    }
}

export default UserItem;
