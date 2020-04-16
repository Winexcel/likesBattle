import React from "react";
import "./UserStats.sass";
import { pluralize } from "../../services/OverAllFunctions/OverAllFunctions";

const UserStats = props => {
    return (
        <div className="UserStats">
            <div className="UserStats-Item">
                <div className="UserStats-ItemWrapper">
                    <span className="UserStats-Coin Icon-Likes"/>
                    <div className="UserStats-ItemCount">
                        <div className="UserStats-ItemText">{ props.usersLikes }</div>
                    </div>
                    <div className="UserStats-SubText">
                        { pluralize(props.usersLikes, ['Лайк', 'Лайка', 'Лайков']) }
                    </div>
                </div>
            </div>
            <div className="UserStats-Delimiter"></div>
            <div className="UserStats-Item">
                <div className="UserStats-ItemWrapper">
                    <span className="UserStats-Coin Icon-Coin"/>
                    <div className="UserStats-ItemCount">
                        <div className="UserStats-ItemText">{ props.ownLikes }</div>
                    </div>
                    <div className="UserStats-SubText">
                        { pluralize(props.ownLikes, ['Монета', 'Монеты', 'Монет']) }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserStats;
