import store from '@/store'
export default {
  install (Vue, options) {
    if (options.developmentOff && process.env.NODE_ENV === 'development') return
    Vue.config.errorHandler = (error, vm, mes) => {
      let info = {
        type: 'script',
        code: 0,
        mes: error.message,
        url: window.location.href
      }
      Vue.nextTick(() => {
        // store.dispatch('addErrorLog', info)
        console.log(info)
      })
    },
    Vue.prototype.$utils={//全局方法
      pkAccess:function(key) {//获取url中的参数
          return store.state.user.access.includes(key)
      }
    }
  }
}
