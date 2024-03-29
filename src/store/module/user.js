import company from '@/router/module/company-center.js'
import { Modal, Message } from 'iview'
import MD5 from 'js-md5'
// 用户模块
import { login, logout, getUserInfo, getNavList, changePwd } from '@/api/user'
import { getProvinceCityList, getCityOperatorTree } from '@/api/common'
import { treeDataTranslate, cpTranslate, cppTranslate } from '@/libs/tools'
import defaultAvator from '@/assets/images/logo-min.jpg'
// 菜单模块
import {
    // setToken,
    getToken,
    setCookie,
    getBreadCrumbList,
    setTagNavListInLocalstorage,
    getMenuByRouter,
    getTagNavListFromLocalstorage,
    getHomeRoute,
    getNextRoute,
    routeHasExist,
    routeEqual,
    getRouteTitleHandled,
    localSave,
    localRead,
    checkMenuHide,
    TOKEN_KEY
} from '@/libs/util'
import beforeClose from '@/router/before-close'
import HttpRequest from '@/libs/axios'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const $Modal = Modal
const $Message = Message
const { homeName } = config
const closePage = (state, route) => {
    const nextRoute = getNextRoute(state.tagNavList, route)
    state.tagNavList = state.tagNavList.filter(item => {
        return !routeEqual(item, route)
    })
    router.push(nextRoute)
}
export default {
    state: {
        // 用户模块
        userAccount: '',
        userName: '',
        userId: '',
        avatorImgPath: '',
        token: getToken(),
        access: '',
        accessList: {},
        hasGetInfo: false,
        // app 模块
        breadCrumbList: [],
        tagNavList: [],
        homeRoute: getHomeRoute(routers, homeName),
        local: localRead('local'),
        errorList: [],
        hasReadErrorPage: false,
        routers: routers
    },
    getters: {
        menuList: (state, getters, rootState) => checkMenuHide(state.routers, rootState.user.accessList),
        errorCount: state => state.errorList.length,
        userAccount: state => state.userAccount,
        userId: state => state.userId,
        getUserName: state => state.userName
    },
    mutations: {
        setAvator(state, avatorPath) {
            state.avatorImgPath = avatorPath
        },
        setUserId(state, id) {
            state.userId = id
        },
        setUserName(state, name) {
            state.userName = name
        },
        userAccount(state, account) {
            state.userAccount = account
        },
        setToken(state, token, day) {
            state.token = token
            if (day) {
                day = 30
            }
            setCookie(TOKEN_KEY, token, day)
        },
        // 菜单module
        changeRouters(state, list) {
            state.routers = list
        },
        setBreadCrumb(state, route) {
            state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
        },
        setTagNavList(state, list) {
            let tagList = []
            if (list) {
                tagList = [...list]
            } else tagList = getTagNavListFromLocalstorage() || []
            if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
            let homeTagIndex = tagList.findIndex(item => item.name === homeName)
            if (homeTagIndex > 0) {
                let homeTag = tagList.splice(homeTagIndex, 1)[0]
                tagList.unshift(homeTag)
            }
            state.tagNavList = tagList
            setTagNavListInLocalstorage([...tagList])
        },
        closeTag(state, route) {
            let tag = state.tagNavList.filter(item => routeEqual(item, route))
            route = tag[0] ? tag[0] : null
            if (!route) return
            if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
                new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
                    if (close) {
                        closePage(state, route)
                    }
                })
            } else {
                closePage(state, route)
            }
        },
        addTag(state, { route, type = 'unshift' }) {
            let router = getRouteTitleHandled(route)
            if (!routeHasExist(state.tagNavList, router)) {
                if (type === 'push') state.tagNavList.push(router)
                else {
                    if (router.name === homeName) state.tagNavList.unshift(router)
                    else state.tagNavList.splice(1, 0, router)
                }
                setTagNavListInLocalstorage([...state.tagNavList])
            }
        },
        setLocal(state, lang) {
            localSave('local', lang)
            state.local = lang
        },
        // addError (state, error) {
        //   state.errorList.push(error)
        // },
        setHasReadErrorLoggerStatus(state, status = true) {
            state.hasReadErrorPage = status
        },
        setAccessList(state, list) {
            state.accessList = list;
        },
        setHasGetInfo(state, status) {
            state.hasGetInfo = status;
        }
    },
    actions: {
        // 登录
        handleLogin({ commit }, { userName, password }) {
            userName = userName.trim()
            return new Promise((resolve, reject) => {
                let params = {
                    userName,
                    password: MD5(MD5(password).toUpperCase()).toUpperCase()
                }
                login(params).then(res => {
                    commit('setToken', res.data.access_token, 30)
                    resolve(res)
                })
            })
        },
        // 退出登录
        handleLogOut({ state, commit }) {
            return new Promise((resolve, reject) => {
                /*logout(state.token).then(() => {
                    commit('setToken', '')
                    commit('setAccess', [])
                    resolve()
                }).catch(err => {
                    reject(err)
                })*/
                // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
                commit('setToken', '')
                commit('setHasGetInfo', false)
                resolve()
            })
        },
        getNavList({ state, commit }) {
            return new Promise((resolve, reject) => {
                getNavList().then(res => {
                    let menuList = {}
                    let btnList = {}
                    let data = res.data.data || []
                    data.map(item => {
                        if (item.route && item.type === 1) {
                            menuList[item.route] = item
                        } else {
                            btnList[item.route] = item
                        }
                    })
                    if(!data.length) $Message.warning('暂无菜单权限，请联系管理员')

                    /*
                    * 手动添加未配置权限的菜单，鉴权添加后，删除此代码
                    */
                    // hide menu
                    // menuList['financial-reconciliation'] = true // 财务日对账
                    menuList['user-group'] = true // 用户群管理
                    menuList['activity-manage'] = true // 活动管理
                    menuList['car-gps'] = true // 车辆GPS
                    // hide menu
                    // menuList['approval_control'] = true // 审批管理
                    // hide menu
                    // menuList['companyCenter'] = true // 企业用车
                    company.children.forEach(item => {
                        menuList[item.name] = true
                        if (typeof(item.children) !== 'undefined') {
                            item.children.forEach(_item => {
                                menuList[_item.name] = true
                            })
                        }
                    })

                    commit('setAccessList', menuList) // 第一次登录请求的时候使用
                    localStorage.setItem(config.menuStorageKey, JSON.stringify(menuList)) // 后续使用无需请求
                    localStorage.setItem(config.btnStorageKey, JSON.stringify(btnList))
                    resolve(res)
                })
            })
        },
        // 获取用户相关信息（刷新页面时调用，router/index.js）
        getUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(res => {
                    commit('userAccount', res.data.data.accountName)
                    commit('setAvator', defaultAvator)
                    commit('setUserName', res.data.data.name)
                    commit('setHasGetInfo', true)
                    resolve(res)
                })
            })
        },
        // 获取公共信息
        getCommonData () {
            getProvinceCityList().then(response => { // 获取省、市级联列表
                let transformData = JSON.stringify(cpTranslate(response.data.data))
                localStorage.setItem('provinceCityList', transformData)
            })
            getCityOperatorTree().then(response => { // 获取省、市、运营商级联列表
                let transformData = JSON.stringify(cppTranslate(response.data.data))
                localStorage.setItem('pcOperatorList', transformData)
            })
        },
        // app.js module  //错误日志
        // addErrorLog ({ commit, rootState }, info) {
        //   if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
        //   const { user: { token, userId, userName } } = rootState
        //   let data = {
        //     ...info,
        //     time: Date.parse(new Date()),
        //     token,
        //     userId,
        //     userName
        //   }
        //   saveErrorLogger(info).then(() => {
        //     commit('addError', data)
        //   })
        // },
        // 修改密码
        handleChangePwd({ commit }, parameter) {
            const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
            const axios = new HttpRequest(baseUrl)
            for (let i in parameter) {
                parameter[i] = parameter[i].trim()
            }
            return axios.request({
                url: '/auth-api/api/v1/account/updateUserPassword',
                data: {
                    oldPassword: MD5(MD5(parameter.oldPwd).toUpperCase()).toUpperCase(),
                    password: MD5(MD5(parameter.newPwd).toUpperCase()).toUpperCase()
                },
                method: 'post',
                headers: {
                  'Authorization': parameter.authorization,
                }
            })
        }
    }
}
