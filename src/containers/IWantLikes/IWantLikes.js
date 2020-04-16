import React from "react";
import "./IWantLikes.sass";

import PayedLikes from "../../components/PayedLikes/PayedLikes";
import CodoAPI from "../../services/CodoAPI/CodoAPI";
import { Link } from "react-router-dom";

class IWantLikes extends React.Component {

    state = {
        buyingLikes: 0,
    }

    componentDidMount() {
        this.updateLikesHandle();
    }

    updateLikesHandle = () => {
        CodoAPI.backend.user.getInfo().then(data => {
            this.setState({
                buyingLikes: data.response.buying_likes,
            })
        })
    }

    render() {
        return (
            <div className="IWantLikes">
                <div className="AntiScroll AntiScroll-IWantLikes"></div>
                <PayedLikes buyingLikes={ this.state.buyingLikes } onUpdateLikes={ this.updateLikesHandle }/>
            </div>
        )
    }
}

export default IWantLikes;