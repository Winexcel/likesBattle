import axios from "axios";
import connectReal from "@vkontakte/vk-connect";
import connectMock from "@vkontakte/vkui-connect-mock";
import { sleep } from "../OverAllFunctions/OverAllFunctions"

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * ( max - min + 1 );
    return Math.round(rand);
}

function sortedObject(object) {
    let keys = Object.keys(object);
    keys.sort();
    let resultObj = {};
    keys.forEach(item => {
        if (typeof resultObj[item] === "object") {
            resultObj[item] = sortedObject(resultObj[item])
        } else {
            resultObj[item] = object[item];
        }
    });

    return resultObj;
}

class _CodoAPI {
    init(serviceToken, launchParameters) {
        this.serviceToken = serviceToken;
        this.VKAPI = new VKAPI(this.serviceToken, launchParameters);
        this.backend = new Backend();
        this.clientInfo = {
            platform: null,
            version: null,
        };

        this.VKAPI.getClientVersion().then((data) => {
            this.clientInfo = {
                platform: data.platform,
                version: data.version,
            };
            this.isMobile = this.clientInfo.platform.toLowerCase() === 'ios'
                || this.clientInfo.platform.toLowerCase() === 'android'
                || this.clientInfo.platform.toLowerCase() === 'mobile-web';
        });
    }
}

class VKAPI {
    constructor(serviceToken, launchParameters) {
        this.serviceToken = serviceToken;
        this.userServiceToken = null;
        this.appId = 7023851;
        this.version = '5.52';
        this.axios = axios.create({ baseURL: 'https://wantlike.ru/api/cors/https://api.vk.com/method/' });
        //this.axios = axios.create({ baseURL: 'http://localhost:3000/cors/https://api.vk.com/method/' });

        //импорт connect в зависимости от параметров запуска, если они пустые значит подключаем мокап
        if (launchParameters !== undefined && launchParameters !== '') {
            this.connect = connectReal;
        } else {
            this.connect = connectMock;
        }

        this.connect.send('VKWebAppInit', {});
        this.setViewSettings({ "status_bar_style": "light", "action_bar_color": "#f44b76" });
        this.startStatusBarUpdater();
    }

    axiosHandle = {
        post: async (method, params) => {
            let response = null;
            while (!response || !response.data) {
                try {
                    response = await this.axios.post(method, params);
                } catch (e) {

                }

                if (!response || !response.data) await sleep(1000);
            }

            return ( response );
        },

        get: async (method, params) => {
            let response = null;
            while (!response || !response.data) {
                try {
                    response = await this.axios.get(method, params);
                } catch (e) {

                }

                if (!response || !response.data) await sleep(1000);
            }

            return ( response );
        }
    }

    startStatusBarUpdater() {
        if (!this.statusBarTimer) {
            this.statusBarTimer = setInterval(() => {
                this.setViewSettings({ "status_bar_style": "light", "action_bar_color": "#f44b76" });
            }, 5000);
        }
    }

    stopStatusBarUpdater() {
        if (this.statusBarTimer) {
            clearTimeout(this.statusBarTimer);
            this.statusBarTimer = null;
        }
    }

    setStandaloneToken(standaloneToken) {
        this.standaloneToken = standaloneToken;
    }

    showImages(images) {
        connectReal.send("VKWebAppShowImages", {
            images,
        });
    }

    enableSwipeBack(images) {
        connectReal.send("VKWebAppEnableSwipeBack");
    }

    async getClientVersion() {
        return new Promise((resolve) => {
            connectReal.subscribe((e) => {
                if (e.detail.type === 'VKWebAppGetClientVersionResult') {
                    resolve(e.detail.data);
                }
            });

            connectReal.send("VKWebAppGetClientVersion", {});
        });
    }

    async getAuthToken({ scope }) {
        return new Promise((resolve) => {
            connectReal.subscribe((e) => {
                if (e.detail.type === 'VKWebAppAccessTokenReceived') {
                    this.userServiceToken = e.detail.data.access_token;
                    resolve(true);
                }
                if (e.detail.type === 'VKWebAppAccessTokenFailed') {
                    resolve(false);
                }
            });

            connectReal.send("VKWebAppGetAuthToken", { "app_id": this.appId, "scope": scope });
        });
    }

    async callAPIMethod({ method, params }) {
        if (!this.userServiceToken) throw new Error('userServiceToken required');

        return new Promise((resolve) => {
            connectReal.subscribe((e) => {
                if (e.detail.type === 'VKWebAppCallAPIMethodResult') {
                    resolve(e.detail.data.response);
                }
                if (e.detail.type === 'VKWebAppCallAPIMethodFailed') {
                    resolve(false);
                }
            });

            connectReal.send('VKWebAppCallAPIMethod', {
                method,
                params: {
                    ...params,
                    v: '5.102',
                    access_token: this.userServiceToken,
                },
            });
        });
    }

    async addToFavorites() {
        return new Promise((resolve) => {
            connectReal.subscribe((e) => {
                if (e.detail.type === 'VKWebAppAddToFavoritesResult') {
                    resolve(true);
                }
                if (e.detail.type === 'VKWebAppAddToFavoritesFailed') {
                    resolve(false);
                }
            });

            connectReal.send("VKWebAppAddToFavorites", {});
        });
    }

    async showWallPostBox({ message, attachments }) {
        return new Promise((resolve) => {
            connectReal.subscribe((e) => {
                if (e.detail.type === 'VKWebAppShowWallPostBoxResult') {
                    resolve(true);
                }
                if (e.detail.type === 'VKWebAppShowWallPostBoxFailed') {
                    resolve(false);
                }
            });

            connectReal.send("VKWebAppShowWallPostBox", {
                message,
                attachments,
            });
        });
    }

    allowNotifications() {
        return new Promise((resolve) => {
            connectReal.subscribe((e) => {
                if (e.detail.type === 'VKWebAppAllowNotificationsResult') {
                    resolve(true);
                }
                if (e.detail.type === 'VKWebAppAllowNotificationsFailed') {
                    resolve(false);
                }
            });

            connectReal.send("VKWebAppAllowNotifications", {});
        });
    }

    async joinGroup(groupId) {
        return new Promise((resolve) => {
            connectReal.subscribe((e) => {
                if (e.detail.type === 'VKWebAppJoinGroupResult') {
                    resolve(true);
                }
                if (e.detail.type === 'VKWebAppJoinGroupFailed') {
                    resolve(false);
                }
            });

            connectReal.send("VKWebAppJoinGroup", { "group_id": groupId });
        });
    }


    async openPayForm(type, id, count) {
        connectReal.subscribe((e) => {
            let res = JSON.stringify(e.detail);
            if (e.detail.type === 'VKWebAppOpenPayFormResult') {
            }
            if (e.detail.type === 'VKWebAppOpenPayAppFailed') {
            }

        });


        let response = await CodoAPI.backend.user.getPaymentBill(type, id, count);
        let settings = {
            app_id: this.appId,
            action: "pay-to-service",
            params: { ...response }
        };

        connectReal.send("VKWebAppOpenPayForm", settings);
    }

    database = {
        getCities: async (q, country_id = 1) => {
            const method = 'database.getCities';
            const params = `country_id=${ country_id }&q=${ q }&v=${ this.version }&lang=ru&access_token=${ this.serviceToken }`;

            let response = await this.axiosHandle.get(method + '?' + params);
            return response.data.response;
        }
    }

    groups = {
        isMember: async (groupId, userId) => {
            const method = 'groups.isMember';
            const params = `group_id=${ groupId }&user_id=${ userId }&v=${ this.version }&lang=ru&access_token=${ this.serviceToken }`;

            let response = await this.axiosHandle.get(method + '?' + params);
            return response.data.response;
        }
    }

    likes = {
        add: async (object) => {
            if (!this.standaloneToken) throw new Error('standaloneToken required');

            let type = '';
            for (let i = 0; i < object.length; i++) {
                if (!isNaN(parseInt(object[i]))) break;
                type += object[i];
            }
            const ownerId = object.slice(object.indexOf('photo') + 5, object.indexOf('_'));
            const itemId = object.slice(object.indexOf('_') + 1, object.length);
            const method = 'likes.add';
            const params = `type=${ type }&owner_id=${ ownerId }&item_id=${ itemId }&v=${ this.version }&lang=ru&access_token=${ this.standaloneToken }`;
            let response = await this.axiosHandle.get(method + '?' + params);

            return response.data;
        }
    }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            this.connect.subscribe((e) => {
                if (e.detail.type === 'VKWebAppGetUserInfoResult') {
                    resolve(e.detail.data);
                }
            });

            this.connect.send('VKWebAppGetUserInfo', {});
        })
    }

    setViewSettings(settings) {
        //нужно испоьзовать именно библиотеку vk-connect а не mock для установки бара
        connectReal.send("VKWebAppSetViewSettings", settings);
    }

    async getCountryIdByCode(code) {
        const method = 'database.getCountries';
        const params = `code=${ code }&v=${ this.version }&lang=ru&access_token=${ this.serviceToken }`;
        let response = await this.axiosHandle.get(method + '?' + params);

        return response.data;
    }
}

class Backend {
    constructor(launchParameters) {
        this.axios = axios.create({ baseURL: 'https://wantlike.ru/api/' });
        //this.axios = axios.create({ baseURL: 'http://localhost:3000/' });
        this.launchParameters = launchParameters;
    }

    axiosHandle = {
        post: async (method, params) => {
            let response = null;
            while (!response || !response.data) {
                try {
                    response = await this.axios.post(method, params);
                } catch (e) {

                }

                if (!response || !response.data) await sleep(1000);
            }

            return ( response );
        },

        get: async (method, params) => {
            let response = null;
            while (!response || !response.data) {
                try {
                    response = await this.axios.get(method, params);
                } catch (e) {

                }

                if (!response || !response.data) await sleep(1000);
            }

            return ( response );
        }
    }

    user = {
        auth: async (launchParameters) => {
            if (launchParameters === '') {
                this.accessToken = 'TOKEN_FOR_TEST';
                return {
                    response: {
                        is_first_start: false,
                        access_token: this.accessToken,
                    }
                }
            }

            //let responseLocation = await CodoAPI.backend.geo.getLocation();

            const method = 'user.auth';
            const params = new URLSearchParams();
            params.append('launch_parameters', launchParameters);
            //params.append('city_id', responseLocation.response.city_id);
            //params.append('country_id', responseLocation.response.country_id);

            let response = '';
            try {
                response = await this.axiosHandle.post(method, params);

                if (response.data.response.access_token) this.accessToken = response.data.response.access_token;
                if (response.data.response.is_first_start !== undefined) this.isFirstStart = response.data.response.is_first_start;

            } catch (e) {

            }

            return response.data;
        },

        getPaymentBill: async (type, id, count) => {
            const method = 'user.getPaymentBill';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            params.append('type', type);
            params.append('id', id);
            params.append('count', count);

            let response = await this.axiosHandle.post(method, params);
            return response.data;
        },

        getInfo: async (userId = undefined) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'user.getInfo';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            if (userId !== undefined) params.append('user_id', userId);

            let response = await this.axiosHandle.post(method, params);

            return response.data;
        },

        getUsersLikes: async (count = 10, offset = 0, sex) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'user.getUsersLikes';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            params.append('count', count);
            params.append('offset', offset);
            if (sex) params.append('sex', sex);

            let response = await this.axiosHandle.post(method, params);
            return response.data;
        },

        openUser: async (user) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'user.openUser';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            if (user.voteIdentificator) params.append('vote_identificator', user.voteIdentificator);
            if (user.likeIdentificator) params.append('like_identificator', user.likeIdentificator);

            let response = await this.axiosHandle.post(method, params);
            return response.data;
        },

        setSettings: async (settings) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'user.setSettings';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            if (settings.isAnonim !== undefined) params.append('is_anonim', settings.isAnonim ? 1 : 0);
            if (settings.notificationsEnabled !== undefined) params.append('notifications_enabled', settings.notificationsEnabled ? 1 : 0);

            let response = await this.axiosHandle.post(method, params);
            return response.data;
        }
    }


    geo = {
        getLocation: async () => {
            const method = 'geo.getLocation';
            let response = await this.axios.get(method);

            return response.data;
        }
    }

    top = {
        getUsers: async (count = 10, offset = 0, sex = 0) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'top.getUsers';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            params.append('count', count);
            params.append('offset', offset);
            if (sex) params.append('sex', sex);

            let response = await this.axiosHandle.post(method, params);
            return response.data;
        }
    }

    battle = {
        get: async () => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'battle.get';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);

            let response = await this.axiosHandle.post(method, params);
            return response.data;
        },

        setFilters: async (filters) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'battle.setFilters';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            if (filters.age) {
                if (filters.age.from >= 15 || filters.age.to <= 84)
                    params.append('age', JSON.stringify(filters.age));
            }
            if (filters.sex === 0 || filters.sex) params.append('sex', filters.sex);
            if (filters.place && filters.place.title) {
                params.append('place', JSON.stringify({
                    title: filters.place.title,
                    country_id: filters.place.countryId,
                    city_id: filters.place.cityId,
                }));
            }

            this.axiosHandle.post(method, params);
        },

        addVote: async (voteIdentificator, userWin) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'battle.addVote';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            params.append('vote_identificator', voteIdentificator);
            params.append('user_win', userWin);

            let response = await this.axiosHandle.post(method, params);
            return response.data;
        }
    }

    quests = {
        get: async () => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'quests.get';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);

            let response = await this.axiosHandle.post(method, params);
            return response.data;
        },

        set: async (questId, parameters) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'quests.set';
            const params = new URLSearchParams();
            params.append('quest_id', questId);
            params.append('parameters', JSON.stringify(parameters));
            params.append('access_token', this.accessToken);

            let response = await this.axiosHandle.post(method, params);
            return response.data;
        },

        setTimerOnline: async () => {
            this.quests.unsetTimerOnline();
            this.quests.get().then(data => {
                let quest = data.response;
                //если сейчас второй квест активен
                if (quest.questInfo.questId == 2 && quest.parameters.currentStep == 1) {
                    this.quests.unsetTimerOnline();
                    this.timerOnline = setInterval(() => {
                        CodoAPI.backend.quests.set(2, { online: true }).then(response => {
                            if (response.response == 'quests time limit') {
                                CodoAPI.backend.quests.unsetTimerOnline();
                            }
                        })
                    }, 60 * 1000);
                }
            });
        },

        unsetTimerOnline: () => {
            clearInterval(this.timerOnline);
        },
    }

    photos = {
        getAll: async (userId = undefined) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'photos.getAll';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            if (userId !== undefined) params.append('user_id', userId);

            let response = await this.axiosHandle.post(method, params);

            return response.data;
        }
    }

    likes = {
        add: async (userId, photoId) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'likes.add';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            params.append('user_id', userId);
            params.append('photo_id', photoId);

            let response = await this.axiosHandle.post(method, params);

            return response.data;
        },

        delete: async (userId, photoId) => {
            if (!this.accessToken) throw new Error('access_token required');

            const method = 'likes.delete';
            const params = new URLSearchParams();
            params.append('access_token', this.accessToken);
            params.append('user_id', userId);
            params.append('photo_id', photoId);

            let response = await this.axiosHandle.post(method, params);

            return response.data;
        }
    }
}

const CodoAPI = new _CodoAPI();
// Object.freeze(instance);

export default CodoAPI;
