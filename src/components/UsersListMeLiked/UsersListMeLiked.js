import React, { Component } from 'react';
import "./UsersListMeLiked.sass";
import UserItemMeLiked from "./UserItemMeLiked/UserItemMeLiked";
import { connect } from "react-redux";
import PopoutWrapper from "../UI/Popouts/PopoutWrapper/PopoutWrapper";
import PopoutOpenLink from "../UI/Popouts/PopoutOpenLink/PopoutOpenLink";
import CodoAPI from "../../services/CodoAPI/CodoAPI";
import { GlobalContext } from "../../App";
import PopoutNoLikes from "../UI/Popouts/PopoutNoLikes/PopoutNoLikes";
import UserItem from "../UsersList/UserItem/UserItem";


class UsersListMeLiked extends Component {

    constructor(props) {
        super(props);

        this.state = {
            openUser: null,
            tabBar: {
                className: 'UsersList-HeaderLink',
                activeClassName: 'UsersList-HeaderLink_active',
                link1: 'UsersList-HeaderLink' + ( this.props.sex === 2 ? ' UsersList-HeaderLink_active' : '' ),
                link2: 'UsersList-HeaderLink' + ( this.props.sex === 1 ? ' UsersList-HeaderLink_active' : '' ),
                link3: 'UsersList-HeaderLink' + ( this.props.sex === 0 ? ' UsersList-HeaderLink_active' : '' ),
            },
        };

        this.scrollHandle = this.scrollHandle.bind(this);
    }

    tabBarClickHandle = (tabId) => {
        if (this.props.onFilter) {
            if (tabId === 1) this.props.onFilter(2);
            if (tabId === 2) this.props.onFilter(1);
            if (tabId === 3) this.props.onFilter(0);
        }


        const tabBar = { ...this.state.tabBar };
        tabBar.link1 = tabBar.className;
        tabBar.link2 = tabBar.className;
        tabBar.link3 = tabBar.className;

        switch (tabId) {
            case 1:
                tabBar.link1 = tabBar.link1 + ' ' + tabBar.activeClassName;
                break;
            case 2:
                tabBar.link2 = tabBar.link2 + ' ' + tabBar.activeClassName;
                break;
            case 3:
                tabBar.link3 = tabBar.link3 + ' ' + tabBar.activeClassName;
                break;
            default:
                tabBar.link1 = tabBar.link1 + ' ' + tabBar.activeClassName;
        }

        this.setState({
            tabBar,
        })
    };

    scrollHandle(event) {
        let scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );

        if (( scrollHeight - window.scrollY ) < ( window.innerHeight + ( scrollHeight / 100 * 20 ) )) {
            this.props.onUpdate();
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.scrollHandle)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollHandle);
    }

    render() {
        return (
            <div className="UsersListMeLiked">
                <ul className="UsersList-Header">
                    <li className="UsersList-HeaderItem">
                        <button
                            className={ this.state.tabBar.link1 }
                            onClick={ this.tabBarClickHandle.bind(this, 1) }
                        >
                            Парни
                        </button>
                    </li>
                    <li className="UsersList-HeaderItem">
                        <button
                            className={ this.state.tabBar.link2 }
                            onClick={ this.tabBarClickHandle.bind(this, 2) }

                        >
                            Девушки
                        </button>
                    </li>
                    <li className="UsersList-HeaderItem">
                        <button
                            className={ this.state.tabBar.link3 }
                            onClick={ this.tabBarClickHandle.bind(this, 3) }
                        >
                            Все
                        </button>
                    </li>
                </ul>

                <div className="UsersListMeLiked-ListWrapperBg">
                    <div className="UsersListMeLiked-ListWrapper">
                        <ul className="UsersListMeLiked-List">
                            {
                                this.props.users.length > 0
                                    ? this.props.users.map((user, id) => {
                                        return <UserItemMeLiked
                                            key={ id }
                                            className="UsersListMeLiked-Item"
                                            user={ user }
                                            ownLikes={ this.props.ownLikes }
                                            onOpenUser={ this.props.onOpenUser }
                                        />;
                                    })
                                    : this.props.emptyListMessage ? this.props.emptyListMessage : null
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );

    }
}

export default UsersListMeLiked;
