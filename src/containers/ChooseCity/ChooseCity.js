import React from "react";
import "./ChooseCity.sass";
import Input from "../../components/UI/Inputs/Input/Input";
import { connect } from "react-redux";
import { filtersChangePlace } from "../../store/actions/filters";
import { withRouter } from "react-router-dom";
import CodoAPI from "../../services/CodoAPI/CodoAPI";


class ChooseCity extends React.Component {

    state = {
        citiesList: [],
        inputCity: '',
        isFirstRender: true,
    };

    updateCitiesList(items) {
        this.setState({
            citiesList: items,
        })
    }

    componentDidMount() {
        this.props.filtersChangePlace({ title: '', cityId: null, countryId: null });

        CodoAPI.backend.battle.setFilters({
            ...this.props.filters,
            place: {
                title: '',
                countryId: null,
                cityId: null,
            }
        });

        CodoAPI.VKAPI.database.getCities('').then(res => {
            this.updateCitiesList(res.items);
            if (this.state.isFirstRender) this.setState({ isFirstRender: false })
        })
    }

    render() {
        return (
            <div className="ChooseCity">

                <div className="ChooseCity-InputWrapper">
                    <Input
                        placeholder="Поиск"
                        className="ChooseCity-Input"
                        inputClassName="ChooseCity-InputClearPadding"
                        value={ this.state.inputCity }
                        onKeyDown={ (event) => {
                            if(event.keyCode == 13) {
                                event.target.blur();
                            }
                        } }
                        onChange={ (event) => {
                            //фильтруем входящее значение
                            // разрешено ставить русские и английские символы, пробел, и знак минуса -
                            let symbols = event.target.value.split('');
                            symbols = symbols.filter(symbol => {
                                let result = /^[а-яА-ЯA-Za-z\s\-]*$/.test(symbol);
                                return result;
                            })

                            let inputCity = symbols.join('');
                            this.setState({ inputCity });
                            //RU - Россия
                            CodoAPI.VKAPI.database.getCities(inputCity, 1).then(resRU => {
                                //UA -  Украина
                                CodoAPI.VKAPI.database.getCities(inputCity, 2).then(resUA => {
                                    //BY - Беларусь
                                    CodoAPI.VKAPI.database.getCities(inputCity, 3).then(resBY => {
                                        //KZ - Казахстан
                                        CodoAPI.VKAPI.database.getCities(inputCity, 4).then(resKZ => {
                                            //AZ - Азербайджан
                                            CodoAPI.VKAPI.database.getCities(inputCity, 5).then(resAZ => {
                                                this.updateCitiesList(resRU.items.concat(resUA.items, resBY.items, resKZ.items, resAZ.items));
                                            });
                                        });
                                    });
                                })
                            })
                        } }
                    />
                    <button className="ChooseCity-InputClear"
                            onClick={ (event) => {
                                this.setState({ inputCity: '' });
                                CodoAPI.VKAPI.database.getCities('').then(res => {
                                    this.updateCitiesList(res.items);
                                })
                            } }
                    />
                </div>


                <div className="ChooseCity-CitiesList CitiesList">

                    {
                        this.state.citiesList.length > 0
                            ? this.state.citiesList.map(item => (
                                <div key={ item.id } className="CitiesList-Item" onClick={ () => {
                                    CodoAPI.backend.battle.setFilters({
                                        ...this.props.filters,
                                        place: {
                                            title: item.title,
                                            countryId: 1,
                                            cityId: item.id,
                                        }
                                    });
                                    this.props.filtersChangePlace({ title: item.title, countryId: 1, cityId: item.id });
                                    this.props.history.goBack();
                                } }>
                                    <div className="CitiesList-ItemName">{ item.title }</div>
                                    {
                                        item.region || item.area
                                            ?
                                            <div className="CitiesList-ItemRegion">
                                                {
                                                    item.region
                                                        ? ( item.area ? item.area + ', ' + item.region : item.region )
                                                        : item.area
                                                }
                                            </div>
                                            : null
                                    }
                                </div>
                            ))
                            : ( this.state.isFirstRender ? '' : 'По вашему запросу ничего не найдено.' )
                    }
                </div>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        filters: state.filters,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        filtersChangePlace: (place) => dispatch(filtersChangePlace(place))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChooseCity));
