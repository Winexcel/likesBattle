import React, {Component} from "react";
import "./PayedLikes.sass";
import melikes from "../../files/icons/melikes.svg";
import LikesOffer from "../LikesOffer/LikesOffer";
import LikesOffer2 from "../LikesOffer2/LikesOffer2";
import Tabs from "../Tabs/Tabs";
import CodoAPI from "../../services/CodoAPI/CodoAPI";
import QuestsList from "../QuestsList/QuestsList";
import QuestItem from "../QuestsList/QuestItem/QuestItem";
import PopoutWrapper from "../UI/Popouts/PopoutWrapper/PopoutWrapper";
import PopoutUniversal from "../UI/Popouts/PopoutUniversal/PopoutUniversal";
import iconSuperLikes from "../../files/icons/icon-superlikes-popup.svg";


class PayedLikes extends Component {
    state = {
        activeTab: 1,
        showPopupAboutSuperLikes: false,
    }

    render() {
        return (
            <>
                {
                    this.state.showPopupAboutSuperLikes
                        ? <PopoutWrapper
                            onBackDropClick={() => {
                                this.setState({
                                    showPopupAboutSuperLikes: false,
                                })
                            }}
                        >
                            <PopoutUniversal>
                                <img
                                    className="PopoutUniversal-Icon"
                                    src={iconSuperLikes}
                                    style={{
                                        borderRadius: '100%',
                                        boxShadow: '0px 2px 20px rgba(241, 74, 130, 0.25)',
                                    }}
                                />
                                <span className="PopoutUniversal-HeaderText">Суперлайки</span>
                                <span
                                    className="PopoutUniversal-Text"
                                    style={{
                                        lineHeight: '19px',
                                    }}
                                >Если ты приобрел лайки — ты счастливый обладатель "премиума" на время. <br/><br/>Ты показываешься в батле под самым высоким приоритетом пока не закончатся суперлайки.</span>
                                <div className="PopoutUniversal-ButtonsContainer">
                                    <button
                                        onClick={() => {
                                            this.setState({
                                                showPopupAboutSuperLikes: false,
                                            })
                                        }}
                                        className="PopoutUniversal-Button PopoutUniversal-ButtonSingle PopoutUniversal-ButtonPrimary PopoutUniversal-Button_circleEffect"
                                    >
                                        Понятно
                                    </button>
                                </div>
                            </PopoutUniversal>
                        </PopoutWrapper>
                        : null
                }

                <div className="PayedLikes">
                    <div className="PayedLikes-Counter">
                        <span
                            className="PayedLikes-CounterNumber">{String(this.props.buyingLikes).replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ")}</span>
                        <span
                            className="PayedLikes-CounterText"
                            onClick={() => {
                                this.setState({
                                    showPopupAboutSuperLikes: true,
                                })
                            }}
                        >Суперлайков</span>
                        <div
                            style={{
                                display: 'inline-block',
                                background: '#F3F3F3',
                                fontSize: '10px',
                                width: '13px',
                                height: '13px',
                                textAlign: 'center',
                                lineHeight: '13px',
                                borderRadius: '50%',
                                color: '#F84D67',
                                fontWeight: 500,
                                transform: 'translate(4px,-5px)',
                                boxSizing: 'border-box',
                                cursor: 'pointer',
                                paddingTop: (CodoAPI.clientInfo.platform == 'android' || CodoAPI.clientInfo.platform == 'ios') ? '1px' : '0px',
                            }}
                        >
                            ?
                        </div>
                        <button className="ButtonRefresh PayedLikes-ButtonRefresh"
                                onClick={this.props.onUpdateLikes}></button>
                    </div>
                </div>
                <div className="Benefits PayedLikes-Benefits">
                    <div className="Benefits-Item">Сразу куча <br/> лайков</div>
                    <div className="Benefits-And">&</div>
                    <div className="Benefits-Item">Увеличение <br/> популярности</div>
                </div>
                <div className="LikesOffer-Container">
                    <QuestsList/>
                    {
                        CodoAPI.clientInfo.platform != 'ios'
                            ? <>
                                <LikesOffer2 type="1" price="49"/>
                                <LikesOffer2 type="2" price="350"/>
                            </>
                            : null
                    }
                    { /*<LikesOffer type="1" counts="100" price="49"/>*/}
                    { /*<LikesOffer type="2" counts="1000" price="350" oldPrice="400"/>*/}
                </div>
            </>
        )
    }
}

export default PayedLikes;
