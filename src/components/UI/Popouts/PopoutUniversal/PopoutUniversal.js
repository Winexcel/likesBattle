import React, { Component } from 'react';
import "./PopoutUnversal.sass";


class PopoutUniversal extends Component {
    render() {
        return (
            <div className="PopoutUniversal">
                { this.props.children }
            </div>
        );

    }
}

export default PopoutUniversal;
