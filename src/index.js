import 'core-js';
import 'raf/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./store/reducers/rootReducer";
import thunk from "redux-thunk";
import CodoAPI from "./services/CodoAPI/CodoAPI";
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';

const store = createStore(rootReducer, applyMiddleware(thunk));

CodoAPI.init('47c5c62647c5c62647c5c626a347a92774447c547c5c6261ab80f7387d50de6a10125c1', window.location.search);
CodoAPI.VKAPI.setViewSettings({ "status_bar_style": "light", "action_bar_color": "#f44b76" });
CodoAPI.backend.user.auth(window.location.search).then(res => {

    //window.location.href = 'https://oauth.vk.com/authorize?client_id=7147617&display=page&redirect_uri=https://codobear.com/&scope=wall&response_type=token&v=5.101&state=123456';

    // CodoAPI.VKAPI.getAuthToken().then(() => {
    //     console.log(CodoAPI.VKAPI.userToken);
    //     CodoAPI.VKAPI.likes.add('515950092_456239018');
    // });

    CodoAPI.backend.quests.setTimerOnline();
    CodoAPI.VKAPI.enableSwipeBack();
    const notificationsEnabled = window.location.search.includes('vk_are_notifications_enabled=1');
    CodoAPI.isFavoriteApp = window.location.search.includes('vk_is_favorite=1');
    CodoAPI.backend.user.setSettings({ notificationsEnabled });

    if (res.response.access_token) {
        const app =
            <Provider store={ store }>
                <BrowserRouter basename={ process.env.PUBLIC_URL }>
                    <App/>
                </BrowserRouter>
            </Provider>;

        const root = document.getElementById('root');
        mVKMiniAppsScrollHelper(root);

        ReactDOM.render(app, root);
    }
});


/**
 * Фикс бага с переходом из приложение и сбросом цвета кепшенбара
 */
window.addEventListener('focus', (event) => {
    CodoAPI.VKAPI.setViewSettings({ "status_bar_style": "light", "action_bar_color": "#f44b76" });
});
