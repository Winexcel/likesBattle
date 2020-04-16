import React from "react";
import "../../components/Preloader/loading.css";
import "./BattleUser.sass";
import defaultAvatar from "../../files/icons/battle-defaultAvatar.svg";
import Preloader from "../Preloader/Preloader";
import LazyImage from "../LazyImage/LazyImage";
import { pluralize } from "../../services/OverAllFunctions/OverAllFunctions";

let urls = [
    'https://sun4-12.userapi.com//c849216//v849216987//1d7282//Gn4R5T6BnRI.jpg?ava=1',
    'https://sun9-7.userapi.com//c856032//v856032087//b6363//f2EhWFHB4Uo.jpg?ava=1',
    'https://sun9-20.userapi.com//c849120//v849120004//1d23a9//gmgK5YLlEBA.jpg?ava=1',
    'https://sun9-50.userapi.com//c857620//v857620238//4709b//gbULQtEQO-M.jpg?ava=1',
    'https://sun4-17.userapi.com//c856120//v856120293//bbf5a//Maor-CD9HLw.jpg?ava=1',
    'https://sun4-15.userapi.com//c841033//v841033768//338f5//c2VVSA4Xaxk.jpg?ava=1',
    'https://sun4-16.userapi.com//c858236//v858236504//63f23//BYgaOokAwtM.jpg?ava=1',
    'https://sun4-11.userapi.com//c824202//v824202637//198077//6qHhsy1RQAU.jpg?ava=1',
    'https://sun4-10.userapi.com//c850524//v850524058//c81//X_H0YuILEp4.jpg?ava=1',
    'https://sun4-17.userapi.com//c851036//v851036461//1aeb34//n4FVIbylEzc.jpg?ava=1',
    'https://sun4-12.userapi.com//c849216//v849216987//1d7282//Gn4R5T6BnRI.jpg?ava=1',
];

class BattleUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                url: urls[0],
            },
            lazyImage: {
                showControls: false,
                width: 0,
            },
            currentAvatar: 0,
        };

        this.imagePreloader = React.createRef();
    }

    changeUser = () => {
        if (this.state.lazyImage.showControls) {
            if (this.props.onAvatarClick) this.props.onAvatarClick();

            let currentAvatar = this.state.currentAvatar;
            currentAvatar = ( currentAvatar + 1 ) % urls.length;
            this.setState({
                currentAvatar
            });
        }
    };

    render() {
        return (
            <div className="BattleUser" onClick={ this.changeUser }>
                <div
                    className="BattleUser-AvatarContainer"
                >
                    <img
                        ref={ this.imagePreloader }
                        className="BattleUser-Avatar BattleUser-AvatarCarcas"
                        src={ defaultAvatar }
                        alt="User avatar"
                    />

                    <LazyImage
                        className="BattleUser-AvatarOrig"
                        src={ this.props.user.photo }
                        width={ this.state.lazyImage.width }
                        //delay={ 1000 }
                        alt=""
                        loader={
                            <div
                                className="BattleUser-PreloaderContainer"
                            >
                                <Preloader/>
                            </div>
                        }
                        error={ <div className="BattleUser-ImgError"/> }
                        onAfterLoading={ () => {
                            const lazyImage = { ...this.state.lazyImage };

                            lazyImage.showControls = true;
                            this.setState({
                                lazyImage
                            });
                        } }
                        onBeforeLoading={ () => {
                            const lazyImage = { ...this.state.lazyImage };

                            lazyImage.showControls = false;
                            this.setState({
                                lazyImage
                            });
                        } }
                        onLoadingError={ () => {
                            const lazyImage = { ...this.state.lazyImage };

                            lazyImage.showControls = true;
                            this.setState({
                                lazyImage
                            });
                        } }
                    />
                </div>

                <div className="BattleUser-InfoWrapper">
                    {
                        this.state.lazyImage.showControls
                            ? <>
                                {
                                    this.props.showHandPick
                                        ? <span className="BattleUser-HandPick" role="img" aria-label="Hand">👇</span>
                                        : null
                                }

                                <button className="BattleUser-Like"></button>
                            </>
                            : null
                    }
                    <div className="BattleUser-Info">
                        <span className="BattleUser-Name">{ this.props.user.name }</span>
                        <span
                            className="BattleUser-Age">{ this.props.user.age } { pluralize(this.props.user.age, ['год', 'года', 'лет']) }</span>
                    </div>
                </div>
            </div>

        )
    }
}

export default BattleUser;

