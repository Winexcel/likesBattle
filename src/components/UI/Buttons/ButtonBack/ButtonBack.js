import React from "react";
import "./ButtonBack.sass";


const ButtonBack = props => {
    const cls = [
        'ButtonBack',
        props.className,
    ];

    return (
        <button
            onClick={ props.onClick }
            className={ cls.join(' ') }
        >
            { props.children }
        </button>
    )
}

export default ButtonBack;