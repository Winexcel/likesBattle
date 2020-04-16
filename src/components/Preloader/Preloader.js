import React from "react";
import "./loading.css";
import "./Preloader.sass";


const Preloader = props => {
    return (
        <div
            className={ 'Preloader ld ld-spin ' + ( props.className ? props.className : '' ) }
            style={ props.style ? props.style : null }
        />


    )
}

export default Preloader;
