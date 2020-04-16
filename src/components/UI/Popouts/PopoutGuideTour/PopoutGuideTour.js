import React, { Component } from 'react';
import "./PopoutGuideTour.sass";
import ilikes from "../../../../files/icons/ilikes-red.svg";
import ButtonWithIcon from "../../Buttons/ButtonWithIcon/ButtonWithIcon";
import { connect } from "react-redux";


class PopoutGuideTour extends Component {
    constructor(props) {
        super(props);

        this.progressBar = React.createRef();
        this.stepCounter = React.createRef();
        this.guideCaption = React.createRef();
        this.guideButton = React.createRef();
        this.guidTours = {
            currentGuid: 0,
            guids: [
                { caption: 'Выбирай, какие аватарки лайкать!', buttonText: 'Хорошо', story: 'BATTLE' },
                { caption: 'Получай лайки!', buttonText: 'Отлично', story: 'LIKES' },
                { caption: 'Попадай в Еженедельный топ!', buttonText: 'Начать', story: 'TOP' },
            ]
        };

        this.currentGuide = this.guidTours.guids[this.guidTours.currentGuid];
    }

    componentDidMount() {
        let progressBar = this.progressBar.current;
        let progressBarStep = progressBar.childNodes[0];
        progressBarStep.style.width = progressBar.offsetWidth * ( ( progressBar.dataset.currentStep  ) / progressBar.dataset.stepCount ) + 'px';
    }

    progressBarHandle() {
        let progressBar = this.progressBar.current;
        let progressBarStep = progressBar.childNodes[0];

        if (+progressBar.dataset.stepCount + 1 === +progressBar.dataset.currentStep) {
            this.props.onUnmountTour();
            return;
        }

        if (progressBar.dataset.stepCount >= progressBar.dataset.currentStep) {
            progressBar.dataset.currentStep = +progressBar.dataset.currentStep + 1;
            if (+progressBar.dataset.stepCount + 1 !== +progressBar.dataset.currentStep) {
                this.stepCounter.current.innerText = `${progressBar.dataset.currentStep}/${progressBar.dataset.stepCount}`;
            } else {
                this.props.onUnmountTour();
                return;
            }
        }
        if (+progressBar.dataset.stepCount + 1 >= +progressBar.dataset.currentStep) {
            if (this.guidTours.currentGuid < this.guidTours.guids.length - 1) {
                this.guidTours.currentGuid++;
                this.currentGuide = this.guidTours.guids[this.guidTours.currentGuid];
                this.guideCaption.current.innerText = this.currentGuide.caption;
                this.guideButton.current.innerText = this.currentGuide.buttonText;
            }

            progressBarStep.style.width = progressBar.offsetWidth * ( ( progressBar.dataset.currentStep ) / progressBar.dataset.stepCount ) + 'px';
            if (+progressBar.dataset.stepCount === +progressBar.dataset.currentStep) {
                progressBarStep.style.borderRadius = '5px 5px 5px 5px';
            }
            this.props.onStoryChange({
                currentTarget: {
                    dataset: {
                        story: this.currentGuide.story,
                    }
                }
            });
        }
    }

    render() {
        return (
            <div className="PopoutGuideTour" onClick={ event => event.stopPropagation() }>
                <div className="PopoutGuideTour-Stepper Stepper">
                    <div className="Stepper-CounterWrap">
                        <div className="Stepper-CounterWrapBg"></div>
                        <span ref={ this.stepCounter } className="Stepper-Counter">1/3</span>
                    </div>
                    <div ref={ this.progressBar } className="Stepper-ProgressBar Stepper-ProgressBar_marginLeft"
                         data-step-count="3" data-current-step="1">
                        <div className="Stepper-ProgressBarStep" style={ { width: '0px' } }></div>
                    </div>
                </div>
                <div ref={ this.guideCaption } className="PopoutGuideTour-Text">{ this.currentGuide.caption }</div>
                <button
                    ref={ this.guideButton }
                    className="PopoutGuideTour-Button"
                    onClick={ this.progressBarHandle.bind(this) }>{ this.currentGuide.buttonText }</button>
            </div>
        );

    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(PopoutGuideTour);
