import React from "react";
import "./ButtonWithIcon.sass";


const ButtonWithIcon = props => {
    const classes = [
        "ButtonWithIcon",
        !!props.className ? props.className : null,
    ];

    let style = {};
    if (props.style) {
        style = { ...style, ...props.style }
    }

    return (
        <button style={ style } onClick={ props.onClick } className={ classes.join(" ") }>{ props.children }</button>
    )
}

export default ButtonWithIcon;