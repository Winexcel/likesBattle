import React from "react";
import ButtonWithIcon from "../UI/Buttons/ButtonWithIcon/ButtonWithIcon";
import UserItem from "./UserItem/UserItem";
import Preloader from "../Preloader/Preloader";
import "./UsersList.sass";
import LazyComponent from "../LazyComponent/LazyComponent";
import { connect } from "react-redux";

class UsersList extends React.Component {

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
        this.tabBarCanChange = true;
    }

    tabBarClickHandle = (tabId) => {
        if(!this.tabBarCanChange) return;

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
        });

        this.tabBarCanChange = false;
        setTimeout(() => {
            this.tabBarCanChange = true;
        }, 500);
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
        let counter = null;

        if (this.props.counted)
            counter = this.props.hasOwnProperty("startsAt") ? this.props.startsAt : 1;

        return (
            <div className={ 'UsersList' }>
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
                            onClick={ this.tabBarClickHandle.bind(this, 2) }
                            className={ this.state.tabBar.link2 }
                        >
                            Девушки
                        </button>
                    </li>
                    <li className="UsersList-HeaderItem">
                        <button
                            onClick={ this.tabBarClickHandle.bind(this, 3) }
                            className={ this.state.tabBar.link3 }
                        >
                            Все
                        </button>
                    </li>
                </ul>

                <div className="UsersList-ListWrapperBg">
                    <div className="UsersList-ListWrapper">
                        {
                            this.props.users.length > 0
                                ?
                                <ul className={'UsersList-List ' + (this.props.counted ? 'UsersList-List_counted' : '') }>

                                    { this.props.users.map((user, id) => (
                                        <li className="UsersList-Item UserItem" key={ id }>
                                            {
                                                <LazyComponent
                                                    loader={
                                                        <>
                                                            {
                                                                this.props.counted
                                                                    ? <div className="UserItem-Number">№</div>
                                                                    : null
                                                            }

                                                            <Preloader
                                                                className="UserItem-Avatar UserItem-AvatarPreloader"/>

                                                            <div className="UserItem-Info">
                                                                <span
                                                                    className="UserItem-Name UserItem-NameLine"></span>
                                                                <span
                                                                    className="UserItem-AdditionalInfo UserItem-AdditionalInfoLine"
                                                                >
                                                        </span>
                                                            </div>

                                                            <div className="UserItem-ButtonWrapper">

                                                                <ButtonWithIcon
                                                                    className="ButtonGoLine"
                                                                >
                                                                </ButtonWithIcon>
                                                            </div>
                                                        </>
                                                    }
                                                >
                                                    <UserItem
                                                        counted={ this.props.counted }
                                                        counter={ counter + id }
                                                        user={ user }
                                                        ownLikes={ this.props.ownLikes }
                                                        onOpenUser={ this.props.onOpenUser }
                                                    />
                                                </LazyComponent>
                                            }
                                        </li>
                                    )) }

                                </ul>
                                : this.props.emptyListMessage ? this.props.emptyListMessage : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        ownLikes: state.user.ownLikes,
    }
}

export default connect(mapStateToProps)(UsersList);
