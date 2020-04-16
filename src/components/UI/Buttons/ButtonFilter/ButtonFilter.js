import React from "react";
import "./ButtonFilter.sass";


const ButtonFilter = props => {
    const cls = [
        'ButtonFilter',
        props.className,
    ];

    return (
        <button className={ cls.join(' ') } onClick={ props.onClick }>
            { props.children }
        </button>
    )
}

export default ButtonFilter;