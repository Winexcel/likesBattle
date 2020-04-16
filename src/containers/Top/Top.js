import React from "react";
import "./Top.sass";
import UsersList from "../../components/UsersList/UsersList";
import Preloader from "../../components/Preloader/Preloader";
import LazyComponent from "../../components/LazyComponent/LazyComponent";
import Top3 from "./Top123/Top123";
import { connect } from "react-redux";
import { topClearUsersList, topUpdateUsersList, topUpdateUsersListSex } from "../../store/actions/top";
import { Link } from "react-router-dom";

class Top extends React.Component {
    componentDidMount() {
        this.props.topUpdateUsersList();
    }

    componentDidUpdate() {
    }

    filterHandle = (sex) => {
        this.props.topClearUsersList();
        this.props.topUpdateUsersListSex(sex);
        this.props.topUpdateUsersList();
    }

    render() {
        return (
            <>
                <div className="AntiScroll AntiScroll-Top"></div>
                <div className="Top">
                    <div className="Top3">

                        { this.props.top.usersList.users.length > 0
                            ? <>
                                <LazyComponent
                                    loader={
                                        <div className="Top3-User User Top3-UserSmall">
                                            <Preloader
                                                className="User-Avatar User-AvatarSmall UserItem-AvatarPreloader"
                                            />
                                            <span
                                                className="User-TopNumber User-TopNumber-2">2</span>
                                            <span className="User-Name User-NameLine"></span>
                                            <span className="User-LikesCount User-LikesCountLine"></span>
                                        </div>

                                    }
                                >
                                    <Top3
                                        user={ {
                                            number: 2,
                                            id: this.props.top.usersList.users[1].id,
                                            photo: this.props.top.usersList.users[1].photo,
                                            name: this.props.top.usersList.users[1].firstName,
                                            likesCount: this.props.top.usersList.users[1].info,
                                        } }
                                    />
                                </LazyComponent>

                                <LazyComponent
                                    loader={
                                        <div className="Top3-User User">
                                            <Preloader
                                                className="User-Avatar UserItem-AvatarPreloader"
                                            />
                                            <span
                                                className="User-TopNumber User-TopNumber-1">1</span>
                                            <span className="User-Name User-NameLine"></span>
                                            <span className="User-LikesCount User-LikesCountLine"></span>
                                        </div>
                                    }
                                >
                                    <Top3
                                        user={ {
                                            number: 1,
                                            id: this.props.top.usersList.users[0].id,
                                            photo: this.props.top.usersList.users[0].photo,
                                            name: this.props.top.usersList.users[0].firstName,
                                            likesCount: this.props.top.usersList.users[0].info,
                                        } }
                                    />
                                </LazyComponent>

                                <LazyComponent
                                    loader={

                                        <div className="Top3-User User">
                                            <Preloader
                                                className="User-Avatar User-AvatarSmall UserItem-AvatarPreloader"
                                            />
                                            <span
                                                className="User-TopNumber User-TopNumber-3">3</span>
                                            <span className="User-Name User-NameLine"></span>
                                            <span className="User-LikesCount User-LikesCountLine"></span>
                                        </div>

                                    }
                                >
                                    <Top3
                                        user={ {
                                            number: 3,
                                            id: this.props.top.usersList.users[2].id,
                                            photo: this.props.top.usersList.users[2].photo,
                                            name: this.props.top.usersList.users[2].firstName,
                                            likesCount: this.props.top.usersList.users[2].info,
                                        } }
                                    />
                                </LazyComponent>

                            </>
                            : null
                        }

                    </div>

                    <UsersList
                        users={ this.props.top.usersList.users.slice(3) }
                        sex={ this.props.top.sex }
                        //users={ [] }
                        onUpdate={ this.props.topUpdateUsersList }
                        counted={ true }
                        startsAt={ 4 }
                        onPopoutNoLikesClick={ this.props.onPopoutNoLikesClick }
                        onFilter={ this.filterHandle }
                        emptyListMessage={
                            <div className="UsersList-Message Message">Загружаю список... 😍</div>
                        }
                    />
                </div>
            </>
        )
    }
}


function mapStateToProps(state) {
    return {
        top: state.top,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        topUpdateUsersListSex: sex => dispatch(topUpdateUsersListSex(sex)),
        topClearUsersList: () => dispatch(topClearUsersList()),
        topUpdateUsersList: () => dispatch(topUpdateUsersList()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Top);