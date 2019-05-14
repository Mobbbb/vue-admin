import Vue from 'vue'
import Vuex from 'vuex'
import common from './module/common'
import user from './module/user'
import app from './module/app'
import record from './module/record'
import cache from './module/cache'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        user,
        app,
        record,
        common,
        cache
    }
})