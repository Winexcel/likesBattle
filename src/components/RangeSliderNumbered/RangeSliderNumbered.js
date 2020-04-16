import React from 'react';
import { RangeSlider } from '@vkontakte/vkui';
import './RangeSliderNumbered.css';

class RangeSliderNumbered extends React.Component {

    constructor(props) {
        super(props);
        /*        this.state = {
                    startNumber: this.props.range.from,
                    endNumber: this.props.range.to
                };*/
        if(this.props.showNumber) {
            this.startNumber = document.createElement('div');
            this.endNumber = document.createElement('div');
            this.startNumber.className = 'Range-Number';
            this.endNumber.className = 'Range-Number';
        }
    }

    updateNumbers = (startNumber, endNumber) => {
        /*        this.setState({
                    startNumber,
                    endNumber,
                });*/

        if(this.props.showNumber) {
            this.startNumber.innerHTML = startNumber;
            this.endNumber.innerHTML = endNumber;
        }
    }

    componentDidMount() {
        if(this.props.showNumber) {
            this.start = document.querySelector('.Slider__thumb--start');
            this.end = document.querySelector('.Slider__thumb--end');

            this.startNumber.innerHTML = this.props.value[0];
            this.endNumber.innerHTML = this.props.value[1];
            this.start.appendChild(this.startNumber);
            this.end.appendChild(this.endNumber);
        }
    }

    onChange(event) {
        if (event[1] >= 18) {
            this.updateNumbers(event[0], event[1]);
            if (this.props.onChange) this.props.onChange(event);
        }
    }

    render() {
        return (
            <RangeSlider
                className={ this.props.className ? this.props.className : '' }
                onChange={ this.onChange.bind(this) }
                min={ 14 }
                max={ 85 }
                step={ 1 }
                value={ [
                    this.props.value[0],
                    this.props.value[1],
                ] }
            />
        )
    }
}

export default RangeSliderNumbered
