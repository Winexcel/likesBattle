import React, { Component } from 'react';
import ReactDOM from "react-dom";
import "./PopoutWrapper.sass";
import CodoAPI from "../../../../services/CodoAPI/CodoAPI";


class PopoutWrapper extends Component {

    constructor(props) {
        super(props);

        this.scrollY = 20;
    }

    preventMotion = (event) => {
        //window.scrollTo(0, this.scrollY);
        event.preventDefault();
        event.stopPropagation();
    }

    componentDidMount() {
        //установка цвета статус бара
        CodoAPI.VKAPI.stopStatusBarUpdater();
        CodoAPI.VKAPI.setViewSettings({ "status_bar_style": "light", "action_bar_color": "#f6d5e0" });

        this.scrollY = window.scrollY;
        window.addEventListener("scroll", this.preventMotion, false);
        window.addEventListener("touchmove", this.preventMotion, false);

        document.body.style.position = "relative";
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";
    }

    componentWillUnmount() {
        //сброс статус бара
        CodoAPI.VKAPI.startStatusBarUpdater();
        CodoAPI.VKAPI.setViewSettings({ "status_bar_style": "light", "action_bar_color": "#f44b76" });

        window.removeEventListener("scroll", this.preventMotion, false);
        window.removeEventListener("touchmove", this.preventMotion, false);

        document.getElementsByTagName("html")[0].style.overflow = "";

        document.body.style.position = "";
        document.body.style.overflow = "";
        document.body.style.height = "";

        // const top = document.body.style.top;
        // document.body.style.position = '';
        // document.body.style.top = '';
        // window.scrollTo(0, parseInt(window.scrollY || '0') * -1);

        // document.getElementsByTagName("html")[0].style.position = "";
        // document.getElementsByTagName("html")[0].style.overflow = "";
        // document.body.style.position = "";
        // document.body.style.overflow = "";
    }

    render() {
        let style = {};
        if (this.props.style) style = { ...style, ...this.props.style };
        return (
            ReactDOM.createPortal(
                <div
                    className={ "PopoutWrapper " + (this.props.className ? this.props.className : '') }
                    onClick={ this.props.onBackDropClick }
                    style={ style }
                >
                    { this.props.children }
                </div>,
                document.body
            )
        );
    }
}

export default PopoutWrapper;






