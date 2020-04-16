import React from "react";
import "./NumberInput.sass";

const NumberInput = props => {
    return (
        <div className="NumberInput">
            <button className="NumberInput-Minus" onClick={ props.onMinus }></button>
            <input className="NumberInput-Input" type="number" value={ props.value } onChange={ props.onChange }/>
            <button className="NumberInput-Plus" onClick={ props.onPlus }></button>
        </div>
    )
}

export default NumberInput;