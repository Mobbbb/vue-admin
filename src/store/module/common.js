import Vue from 'vue'
import { getCitys, getCarNoList } from '@/api/common'

export default {
    state: {
        cityList: [],
    },
    getters: {

    },
    mutations: {
        getCityList(state, data) {
            Vue.set(state, 'cityList', data)
        }
    },
    actions: {
        getCityList({ commit }) {
            getCitys({}).then(res => {
                commit('getCityList', res.data.data)
            })
        }
    }
}