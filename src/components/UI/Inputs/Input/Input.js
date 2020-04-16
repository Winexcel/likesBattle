import React from "react";
import "./Input.sass";

const Input = props => {
    const type = props.type || "text";
    const placeholder = props.placeholder || "";
    const className = [
        "Input-Wrapper"
    ];

    if (props.className) className.push(props.className);

    return (
        <div className={ className.join(" ") }>
            { props.imitate
                ? props.value == ''
                    ? (
                        placeholder == ''
                            ? <span
                                className="Input-Input Input-InputImitate"
                                style={ { userSelect: 'none' } }
                            >&nbsp;</span>
                            : <span
                                className="Input-Input Input-InputImitate Input-InputPlaceholder"
                                style={ { userSelect: 'none' } }
                            >{ placeholder }</span>
                    )
                    : <span className="Input-Input" style={ { userSelect: 'none' } }>{ props.value }</span>
                : <input
                    className={ 'Input-Input ' + ( props.inputClassName ? props.inputClassName : '' ) }
                    type={ type }
                    placeholder={ placeholder }
                    value={ props.value }
                    onChange={ props.onChange }
                    onKeyDown={ props.onKeyDown }
                    readOnly={ props.readOnly ? true : false }
                    onClick={ props.onClick ? props.onClick : null }
                />
            }
        </div>
    )
}

export default Input;
