import React from "react";
import "./QuestItem.sass";
import CodoAPI from "../../../services/CodoAPI/CodoAPI";
import ButtonWithIcon from "../../UI/Buttons/ButtonWithIcon/ButtonWithIcon";
import storyImage from "../../../files/images/stories/1.jpg";
import axios from "axios";
import {Base64} from 'js-base64';
import PopoutWrapper from "../../UI/Popouts/PopoutWrapper/PopoutWrapper";
import PopoutMinimumReward from "../../UI/Popouts/PopoutMinimumReward/PopoutMinimumReward";
import PopoutNoLikes from "../../UI/Popouts/PopoutNoLikes/PopoutNoLikes";
import {connect} from "react-redux";
import {filtersChangeAge, filtersChangePlace, filtersChangeSex} from "../../../store/actions/filters";
import {
    userUpdateFirstName,
    userUpdateOwnLikes,
    userUpdatePhoto100,
    userUpdateUsersLikes
} from "../../../store/actions/user";
import {
    questsSetGlobalTimer,
    questsSetGlobalTimerId,
    questsUnsetGlobalTimer,
    questsUpdateCurrentReward
} from "../../../store/actions/quests";


class QuestItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPopup: false,
            quest: {
                questInfo: {
                    name: 'Загрузка...',
                    checkList: [{label: "Загрузка...", button: "..."}, {label: "Загрузка...", button: "..."}],
                },
                parameters: {
                    countSteps: 1,
                    currentStep: 0,
                    timeToRepeat: 0,
                    reward: '...',
                },
            },
            timeLeft: {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            }
        };

        this.inputFile = React.createRef();

        this.nextStepHandle = this.nextStepHandle.bind(this);
    }

    nextStepHandle() {
        if (this.state.quest.questInfo.questId == 1) this.quest1StepHandle();
        if (this.state.quest.questInfo.questId == 2) this.quest2StepHandle();
    }

    quest1StepHandle() {
        let quest = {...this.state.quest};

        //если шагов меньше или равно чем всего
        if (quest.parameters.currentStep <= quest.parameters.countSteps - 1) {
            //пробуем выполнить это шаг
            this.quest1Step(quest).then(result => {
                if (!result) return;

                quest.parameters.currentStep++;
                CodoAPI.backend.quests.set(quest.questInfo.questId, quest.parameters).then(() => {
                    CodoAPI.backend.quests.get().then(data => {
                        let quest = data.response;
                        this.setState({
                            quest: {...quest},
                        });
                    });
                });
            });
        }
    }

    async quest1Step(quest) {
        return new Promise((resolve, reject) => {
            //прибавляем к текущему шагу +1 и выполняем действие, если действие выполнено то возвращаем true
            let currentStep = quest.parameters.currentStep + 1;
            switch (currentStep) {
                case 1: {
                    CodoAPI.VKAPI.addToFavorites().then(result => {
                        if (result == true) resolve(result);
                        reject(result);
                    });
                    break;
                }
                case 2: {
                    CodoAPI.VKAPI.joinGroup(187630443).then(result => {
                        if (result == true) resolve(result);
                        reject(result);
                    });
                    break;
                }
                case 3: {
                    CodoAPI.VKAPI.getAuthToken({scope: 'stories'}).then(result => {
                        if (result) {
                            CodoAPI.VKAPI.callAPIMethod({
                                method: 'stories.getPhotoUploadServer',
                                params: {add_to_news: 1, link_url: 'https://vk.com/app7023851'}
                            }).then(result => {
                                if (result.upload_url) {
                                    axios.get(storyImage, {responseType: 'blob',}).then(img => {
                                        let formData = new FormData();
                                        let file = new Blob([img.data]);
                                        formData.append("file", file, "story.jpg");
                                        axios.post(result.upload_url, formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        });
                                        resolve(true);
                                    });
                                } else {
                                    resolve(false);
                                }
                            });
                        } else {
                            reject(result);
                        }
                    });
                    break;
                }
            }
        });
    }

    quest2StepHandle() {
        let quest = {...this.state.quest};

        //если шагов меньше или равно чем всего
        if (quest.parameters.currentStep <= quest.parameters.countSteps - 1) {
            //пробуем выполнить это шаг
            this.quest2Step(quest).then(result => {
                if (!result) return;

                CodoAPI.backend.quests.get().then(data => {
                    let quest = data.response;
                    this.setState({
                        quest: {...quest},
                    });

                });
            });
        }
    }

    quest2Step(quest) {
        return new Promise((resolve, reject) => {
                switch (quest.parameters.currentStep) {
                    case 0: {
                        quest.parameters.currentStep++;
                        CodoAPI.backend.quests.set(quest.questInfo.questId, quest.parameters).then(() => {
                            CodoAPI.backend.quests.setTimerOnline().then(() => {
                                this.setCurrentRewardTimer();
                                this.props.questsSetGlobalTimer(quest.parameters.currentReward, 0.0016, quest.parameters.maximumReward, 1000);
                                resolve(true);
                            })
                        });
                        break;
                    }
                    case 1: {
                        if (quest.parameters.currentReward < quest.parameters.minimumReward) {
                            this.setState({showPopup: true});
                            break;
                        }

                        quest.parameters.currentStep++;
                        CodoAPI.backend.quests.set(quest.questInfo.questId, quest.parameters).then(() => {
                            this.unsetCurrentRewardTimer();
                            this.props.questsUnsetGlobalTimer();
                            this.props.questsUpdateCurrentReward(0);
                            CodoAPI.backend.quests.unsetTimerOnline();
                            resolve(true);
                        });
                        break;
                    }
                }
            }
        );
    }

    calcDeg() {
        return ((((this.state.quest.parameters.currentStep * 100) / this.state.quest.parameters.countSteps)) / 100) * 360;
    }

    setTimer() {
        this.unsetTimer();
        this.timerLeft = setInterval(() => {
            if (this.state.quest.parameters.currentStep != 0 && this.state.quest.parameters.passed) this.unsetTimer();

            let date = new Date(this.state.quest.parameters.timeToRepeat - new Date());

            let timeZone = 0;
            if (date.getTimezoneOffset() < 0) {
                timeZone = -date.getTimezoneOffset();
            } else {
                timeZone = date.getTimezoneOffset();
            }

            date.setHours(date.getHours() - timeZone / 60);
            date.setMinutes(date.getMinutes() - timeZone % 60);

            let days = '' + date.getDate();
            let hours = '' + date.getHours();
            let minutes = '' + date.getMinutes();
            let seconds = '' + date.getSeconds();

            if (days.length == 1) days = '0' + days;
            if (hours.length == 1) hours = '0' + hours;
            if (minutes.length == 1) minutes = '0' + minutes;
            if (seconds.length == 1) seconds = '0' + seconds;

            this.setState({
                timeLeft: {
                    hours,
                    minutes,
                    seconds,
                }
            })

        }, 1000);
    }

    unsetTimer() {
        clearInterval(this.timerLeft);
    }

    setCurrentRewardTimer() {
        this.unsetCurrentRewardTimer();
        this.currentRewardTimer = setInterval(() => {
            /* если есть интернет, то инкрементируем */
            debugger;
            if (this.props.online.online === true) {
                let quest = {...this.state.quest};
                if (quest.questInfo.questId != 2) {
                    this.unsetCurrentRewardTimer();
                    return;
                }
                if (quest.questInfo.questId == 2 && quest.parameters.currentReward >= quest.parameters.maximumReward) {
                    this.unsetCurrentRewardTimer();
                    return;
                }


                quest.parameters.currentReward = (+quest.parameters.currentReward + 0.0016).toFixed(4);

                this.setState(quest);
            }
        }, 1000);
    }

    unsetCurrentRewardTimer() {
        clearInterval(this.currentRewardTimer);
    }

    componentDidMount() {
        CodoAPI.backend.quests.get().then(data => {
            let quest = data.response;
            this.setState({
                quest: {...quest},
            });

            //установка таймера для второго квеста
            if ((quest.questInfo.questId == 2) && (quest.parameters.currentStep == 1)) {
                this.setCurrentRewardTimer();
                this.props.questsSetGlobalTimer(quest.parameters.currentReward, 0.0016, quest.parameters.maximumReward, 1000);
            }

            // сброс глобального таймера если собрали лайки на другом устройстве
            if ((quest.questInfo.questId == 2) && (quest.parameters.currentStep == 0)) {
                this.props.questsUnsetGlobalTimer();
                this.props.questsUpdateCurrentReward(0);
            }
        });

        this.setTimer();
    }

    componentWillUnmount() {
        this.unsetCurrentRewardTimer();
        this.unsetTimer();
    }

    render() {
        //рассчет для правильного смещения относительно массива checkList
        let currentStep = (this.state.quest.parameters.currentStep >= this.state.quest.parameters.countSteps) ? this.state.quest.parameters.countSteps - 1 : this.state.quest.parameters.currentStep;

        return (
            <div className="QuestItem">

                {this.state.showPopup
                    ? <PopoutWrapper onBackDropClick={() => {
                        this.setState({showPopup: false});
                    }}>
                        <PopoutMinimumReward
                            onPopoutClose={() => {
                                this.setState({showPopup: false});
                            }}
                            onClick={() => {
                                this.setState({showPopup: false});
                            }}
                        />
                    </PopoutWrapper>
                    : null
                }


                <span className="QuestItem-Name">{this.state.quest.questInfo.name}</span>
                <span
                    className="QuestItem-Reward">{this.state.quest.parameters.reward || this.props.quests.parameters.currentReward}</span>
                <div className="QuestItem-Body">
                    <div className="Pie QuestItem-Pie"
                         style={{background: `conic-gradient(#F9707F ${this.calcDeg()}deg, #E7E7E7 ${this.calcDeg()}deg)`}}>
                        <div className="QuestItem-PieSubstrate">
                            {this.state.quest.parameters.currentStep + ' из ' + this.state.quest.parameters.countSteps}
                        </div>
                    </div>
                    <span
                        className="QuestItem-CurrentStep">{this.state.quest.questInfo.checkList[currentStep].label}</span>
                    <span
                        className="QuestItem-NextStep">Далее: {
                        this.state.quest.parameters.currentStep < this.state.quest.parameters.countSteps - 1
                            ? this.state.quest.questInfo.checkList[currentStep + 1].label
                            : 'Финиш'
                    }</span>

                    {
                        (this.state.quest.parameters.timeToRepeat - Date.now()) > 0
                            ? <span className="QuestItem-TimeLeft">Повторить можно через <span
                                className="QuestItem-TimeLeftMedium">{this.state.timeLeft.hours}:{this.state.timeLeft.minutes}:{this.state.timeLeft.seconds}</span></span>
                            : <ButtonWithIcon
                                className="ButtonQuest QuestItem-ButtonNextStep"
                                onClick={this.nextStepHandle}>
                                {this.state.quest.questInfo.checkList[currentStep].button}
                            </ButtonWithIcon>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        quests: state.quests,
        online: state.online,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        questsSetGlobalTimer: (currentReward, stepReward, maximumReward, delay) => dispatch(questsSetGlobalTimer(currentReward, stepReward, maximumReward, delay)),
        questsUnsetGlobalTimer: () => dispatch(questsUnsetGlobalTimer()),
        questsUpdateCurrentReward: (currentReward) => dispatch(questsUpdateCurrentReward(currentReward))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestItem);
