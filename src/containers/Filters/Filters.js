import React, { Component } from 'react';
import "./Filters.sass";
import RangeSliderNumbered from "../../components/RangeSliderNumbered/RangeSliderNumbered";
import { NavLink } from "react-router-dom";
import Input from "../../components/UI/Inputs/Input/Input";
import { connect } from "react-redux";
import { filtersChangeAge, filtersChangeSex } from "../../store/actions/filters";
//icons
import male from "../../files/icons/filter-man_inactive.svg";
import maleActive from "../../files/icons/filter-man_active.svg";
import female from "../../files/icons/filter-girl_inactive.svg";
import femaleActive from "../../files/icons/filter-girl_active.svg";
import both from "../../files/icons/filter-both_inactive.svg";
import bothActive from "../../files/icons/filter-both_active.svg";
import { RangeSlider } from "@vkontakte/vkui";


class Filters extends Component {
    constructor(props) {
        super(props);

        this.state = {
            textAge: this.getTextAge(this.props.filters.age.from, this.props.filters.age.to),
            headersSaved: {
                className: 'Filter-HeaderSaved Filter-HeaderSavedNone',
                activeClassName: 'Filter-HeaderSavedAnim',
                link1: {
                    timer: null,
                    className: 'Filter-HeaderSaved Filter-HeaderSavedNone',
                },
                link2: {
                    timer: null,
                    className: 'Filter-HeaderSaved Filter-HeaderSavedNone',
                },
                link3: {
                    timer: null,
                    className: 'Filter-HeaderSaved Filter-HeaderSavedNone',
                },
            }
        };

        this.chooseCityRef = React.createRef();

    }

    getTextAge(from, to) {
        let textAge = 'все';
        if (from > 14) textAge = `от ${ from }`;
        if (to < 85) textAge = `до ${ to }`;
        if (from > 14 && to < 85) textAge = `от ${ from } до ${ to }`;

        return textAge;
    }

    componentWillUnmount() {
        clearTimeout(this.state.headersSaved.link1.timer);
        clearTimeout(this.state.headersSaved.link2.timer);
        clearTimeout(this.state.headersSaved.link3.timer);
    }

    render() {
        return (
            <div className="Filters">
                <div className="Filter-Control">
                    <span className="Filter-Header">
                        <span className="Filter-HeaderText">Показывать</span>
                        <span className={ this.state.headersSaved.link1.className }>Сохранено</span>
                    </span>
                    <div className="Filter-Content Filter-ContentFlexRow">
                        <button
                            className="Filter-Sex"
                            onClick={ () => {
                                if (this.props.filters.sex != 2) {
                                    const headersSaved = { ...this.state.headersSaved };

                                    if (headersSaved.link1.timer === null) {
                                        headersSaved.link1.className = headersSaved.className + ' ' + headersSaved.activeClassName;

                                        headersSaved.link1.timer = setTimeout(() => {
                                            const headersSaved = { ...this.state.headersSaved };
                                            headersSaved.link1.className = headersSaved.className;
                                            headersSaved.link1.timer = null;
                                            this.setState({
                                                headersSaved,
                                            });
                                        }, 5000);
                                    }

                                    this.props.filtersChangeSex(2);
                                    this.setState({
                                        headersSaved
                                    });
                                }
                            } }
                        >
                            <img
                                className="Filter-SexImg"
                                src={ this.props.filters.sex == 2 ? maleActive : male }
                                alt=""
                            />
                            <span className="Filter-SexName">Парней</span>
                        </button>
                        <button
                            className="Filter-Sex"
                            onClick={ () => {
                                if (this.props.filters.sex != 1) {
                                    const headersSaved = { ...this.state.headersSaved };

                                    if (headersSaved.link1.timer === null) {
                                        headersSaved.link1.className = headersSaved.className + ' ' + headersSaved.activeClassName;

                                        headersSaved.link1.timer = setTimeout(() => {
                                            const headersSaved = { ...this.state.headersSaved };
                                            headersSaved.link1.className = headersSaved.className;
                                            headersSaved.link1.timer = null;
                                            this.setState({
                                                headersSaved,
                                            });
                                        }, 5000);
                                    }


                                    this.props.filtersChangeSex(1);
                                    this.setState({
                                        headersSaved
                                    });
                                }
                            } }
                        >
                            <img
                                className="Filter-SexImg"
                                src={ this.props.filters.sex == 1 ? femaleActive : female }
                                alt=""
                            />
                            <span className="Filter-SexName">Девушек</span>
                        </button>
                        <button
                            className="Filter-Sex"
                            onClick={ () => {
                                if (this.props.filters.sex != 0) {
                                    const headersSaved = { ...this.state.headersSaved };

                                    if (headersSaved.link1.timer === null) {
                                        headersSaved.link1.className = headersSaved.className + ' ' + headersSaved.activeClassName;
                                        headersSaved.link1.timer = setTimeout(() => {
                                            const headersSaved = { ...this.state.headersSaved };
                                            headersSaved.link1.className = headersSaved.className;
                                            headersSaved.link1.timer = null;
                                            this.setState({
                                                headersSaved,
                                            });
                                        }, 5000);
                                    }

                                    this.props.filtersChangeSex(0);
                                    this.setState({
                                        headersSaved
                                    });
                                }
                            } }
                        >
                            <img
                                className="Filter-SexImg"
                                src={ this.props.filters.sex == 0 ? bothActive : both }
                                alt=""
                            />
                            <span className="Filter-SexName">Всех</span>
                        </button>
                    </div>
                </div>

                <div className="Filter-Control">
                                <span className="Filter-Header">Возраст
                                <span className={ this.state.headersSaved.link2.className }>Сохранено</span>
                                </span>

                    <div className="Filter-Content">
                        <RangeSliderNumbered
                            className="Filters-Age"
                            range={ {
                                from: 14,
                                to: 85,
                            } }
                            value={ [this.props.filters.age.from, this.props.filters.age.to] }
                            onChange={ (range) => {
                                this.props.filtersChangeAge({ from: range[0], to: range[1] });

                                this.setState({
                                    textAge: this.getTextAge(range[0], range[1]),
                                });

                                const headersSaved = { ...this.state.headersSaved };
                                if (headersSaved.link2.timer !== null) return;

                                headersSaved.link2.className = headersSaved.className + ' ' + headersSaved.activeClassName;

                                headersSaved.link2.timer = setTimeout(() => {
                                    const headersSaved = { ...this.state.headersSaved };
                                    headersSaved.link2.className = headersSaved.className;
                                    headersSaved.link2.timer = null;
                                    this.setState({
                                        headersSaved,
                                    });
                                }, 5000);

                                this.setState({
                                    headersSaved
                                });
                            } }
                        />
                        <span
                            className="Filters-AgeCount">{ this.state.textAge }</span>
                    </div>
                </div>

                <div className="Filter-Control">
                                <span className="Filter-Header">Город
                                <span className={ this.state.headersSaved.link3.className }>Сохранено</span>
                                </span>
                    <NavLink to="/battle/chooseCity">
                        <div ref={ this.chooseCityRef } className="Filter-Content">
                            <div className="Filters-InputWrapper">
                                <Input
                                    placeholder="Поиск"
                                    className="ChooseCity-Input"
                                    value={ this.props.filters.place ? this.props.filters.place.title : '' }
                                    readOnly
                                    imitate
                                    onClick={ (event) => {
                                        //фикс бага с открытием клавиатуры на айфоне
                                        event.preventDefault();
                                        this.chooseCityRef.current.click();
                                    } }
                                />
                                <button className="Filters-InputArrowDown"/>
                            </div>
                        </div>
                    </NavLink>
                </div>
            </div>
        );

    }
}


function mapStateToProps(state) {
    return {
        filters: state.filters,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        filtersChangeSex: (sex) => dispatch(filtersChangeSex(sex)),
        filtersChangeAge: (age) => dispatch(filtersChangeAge(age)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
