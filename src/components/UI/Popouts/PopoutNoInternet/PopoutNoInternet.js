import React, { Component } from 'react';
import "./PopoutNoInternet.sass";
import ButtonWithIcon from "../../Buttons/ButtonWithIcon/ButtonWithIcon";


class PopoutNoInternet extends Component {
    /* Нужно загружать иконку сразу, потому что она не загрузится когда нет интернета */
    icon = <svg style={ { verticalAlign: 'middle', marginLeft: '5px' } } width="23" height="24" viewBox="0 0 23 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16.2975 18.7945C19.1862 16.6654 20.236 12.7675 18.8051 9.47574C16.9359 5.17059 11.8125 3.54522 7.85267 5.77274L6.80678 3.9612C6.74867 3.86056 6.592 3.87972 6.5434 3.99165L4.39494 8.88451C4.35927 8.968 4.41193 9.0592 4.50207 9.07006L9.81364 9.65587C9.93487 9.66974 10.028 9.5405 9.9717 9.443L8.92762 7.63461C11.7175 6.08256 15.2899 7.15673 16.7245 10.0773C17.9604 12.5885 17.1215 15.6895 14.792 17.2399C12.3232 18.8834 9.08687 18.3113 7.29873 16.1148C6.96674 15.7068 6.38477 15.6067 5.93188 15.8681C5.36892 16.1932 5.21732 16.9474 5.62678 17.4533C8.16594 20.5874 12.8463 21.3364 16.2975 18.7945Z"
            fill="white"/>
    </svg>;

    render() {
        return (
            <div className="PopoutNoInternet" onClick={ event => event.stopPropagation() }>

                <div className="PopoutNoInternet-Info"/>

                <span className="PopoutNoInternet-UserName">Ошибка</span>
                <p className="PopoutNoInternet-UserDescription">
                    Отсутствует подключение к сети интернет.
                </p>
                <ButtonWithIcon
                    className="PopoutNoInternet-ButtonRefresh ButtonRefreshInternet ButtonRefreshInternet_big"
                >
                    Повторить { this.icon }
                </ButtonWithIcon>

            </div>
        );

    }
}

export default PopoutNoInternet;
