import Vue from 'vue'
import { getCitys } from '@/api/common'
import { getCompanys } from '@/api/company-api/common'

export default {
    state: {
        cityList: [],
        companyList: [],//所有的企业名称
        changeTab: false,
        closeTabInfo: {}
    },
    getters: {

    },
    mutations: {
        getCityList(state, data) {
            Vue.set(state, 'cityList', data)
        },
        setCompanyList(state,data) {
            Vue.set(state, 'companyList', data)
        },
        clearCloseTabInfo(state){
            state.closeTabInfo = {}
        },
        setChangeTab(state,data){
            state.changeTab = !state.changeTab
            Vue.set(state, 'closeTabInfo', data)
        }
    },
    actions: {
        getCityList({ commit }) {
            getCitys({}).then(res => {
                commit('getCityList', res.data.data)
            })
        },
        getCompanyList({commit}) {
            getCompanys().then(res=>{
                commit('setCompanyList', res.data.data)
            })
        }
    }
}