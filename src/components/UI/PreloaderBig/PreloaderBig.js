import React, { Component } from 'react';
import { IOS, platform } from "@vkontakte/vkui/dist/vkui";
import "./PreloaderBig.sass";


class PreloaderBig extends Component {
    render() {
        return (
            <div
                className={ 'PreloaderBig ld ld-spin ' + ( this.props.className ? this.props.className : null ) }
            />
        );

    }
}

export default PreloaderBig;
