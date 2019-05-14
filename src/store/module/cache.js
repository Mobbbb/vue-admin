import Vue from 'vue'

export default {
    state: {
      'order-info': true,//订单管理-订单信息
      'customer-basic': true //乘客管理-乘客信息
    },
    mutations: {
      switchCacheState(state, arr) {
        Vue.set(state, arr[0], arr[1])
      }
    },
}