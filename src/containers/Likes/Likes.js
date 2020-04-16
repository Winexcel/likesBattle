import React from "react";
import UserStats from "../../components/UserStats/UserStats";
import UsersList from "../../components/UsersList/UsersList";
import "./Likes.sass";
import CodoAPI from "../../services/CodoAPI/CodoAPI";
import { connect } from "react-redux";
import { likesClearUsersList, likesUpdateUsersList, likesUpdateUsersListSex } from "../../store/actions/likes";
import { GlobalContext } from "../../App";
import { userUpdateOwnLikes, userUpdateUsersLikes } from "../../store/actions/user";
import UsersListMeLiked from "../../components/UsersListMeLiked/UsersListMeLiked";


class Likes extends React.Component {
    componentDidMount() {
        this.props.likesUpdateUsersList();
    }

    filterHandle = (sex) => {
        this.props.likesClearUsersList();
        this.props.likesUpdateUsersListSex(sex);
        this.props.likesUpdateUsersList();
    }

    openUserHandle = () => {
        this.props.likesClearUsersList();
        this.props.likesUpdateUsersList();

        CodoAPI.backend.user.getInfo().then(data => {
            this.props.userUpdateOwnLikes(data.response.own_likes);
            this.props.userUpdateUsersLikes(data.response.users_likes);
        });
    }

    render() {
        return (
            <div className="Likes">
                <GlobalContext.Consumer>
                    { value => (
                        <>
                            <div className="AntiScroll AntiScroll-Likes"></div>
                            <UserStats
                                ownLikes={ String(this.props.user.ownLikes).replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ") }
                                usersLikes={ String(this.props.user.usersLikes).replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ") }/>
                            <UsersListMeLiked
                                ownLikes={ this.props.user.ownLikes }
                                users={ this.props.likes.usersList.users }
                                sex={ this.props.likes.sex }
                                onFilter={ this.filterHandle }
                                onOpenUser={ this.openUserHandle }
                                onUpdate={ this.props.likesUpdateUsersList }
                                emptyListMessage={
                                    <div className="UsersList-Message Message">Участвуй в <button
                                        className="Message-Link"
                                        onClick={ value.goBattleClickHandle }
                                    >Лайкобатле</button>, и ответные лайки скоро появятся! 😋</div>
                                }
                            />
                            {/*                            <UsersList
                                users={ this.props.likes.usersList.users }
                                sex={ this.props.likes.sex }
                                onUpdate={ this.props.likesUpdateUsersList }
                                onFilter={ this.filterHandle }
                                emptyListMessage={
                                    <div className="UsersList-Message Message">Участвуй в <button
                                        className="Message-Link"
                                        onClick={ value.goBattleClickHandle }
                                    >Лайкобатле</button>, и ответные лайки скоро появятся! 😋</div>
                                }
                                onOpenUser={ this.openUserHandle }
                            />*/ }
                        </>
                    ) }
                </GlobalContext.Consumer>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        likes: state.likes,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        likesUpdateUsersList: () => dispatch(likesUpdateUsersList()),
        likesClearUsersList: () => dispatch(likesClearUsersList()),
        likesUpdateUsersListSex: (sex) => dispatch(likesUpdateUsersListSex(sex)),
        userUpdateOwnLikes: (ownLikes) => dispatch(userUpdateOwnLikes(ownLikes)),
        userUpdateUsersLikes: (usersLikes) => dispatch(userUpdateUsersLikes(usersLikes)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Likes);
