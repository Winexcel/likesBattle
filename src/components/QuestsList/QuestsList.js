import React, { Component } from 'react';
import "./QuestsList.sass";
import QuestItem from "./QuestItem/QuestItem";


class QuestsList extends Component {
  render() {
    return (
        <div className="QuestsList" >
            <QuestItem name={"Бесплатные лайки"}/>
        </div>
    );

  }
}

export default QuestsList;
