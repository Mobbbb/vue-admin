// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import AMap from 'vue-amap'
import iviewArea from 'iview-area'
import moment from 'moment'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import VTable from '_a/v-table/v-table'
import SearchList from '_a/search-list/search-list'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
// 实际打包时应该不引入mock,
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')
// require('@/mock')

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 注册指令
 */
importDirective(Vue)
const customPlugins = {
  install: function(Vue){
    Vue.component('VTable', VTable)
    Vue.component('SearchList', SearchList)
  }
}
Vue.use(customPlugins) // 全局注册自定义组件
Vue.use(iviewArea)
Vue.use(iView, { i18n: (key, value) => i18n.t(key, value) })
Vue.use(AMap)
AMap.initAMapApiLoader({
  // 高德的key
  key: '7333fda4f079977bb5596730631c7075',
  // 插件集合
  plugin: ['AMapManager', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','Geocoder','Geolocation', 'AMap.MarkerClusterer','AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MouseTool', 'AMap.Driving', 'AMap.CitySearch', 'AMap.InfoWindow', 'AMap.LngLat', 'AMap.DistrictSearch', 'AMap.TileLayer.Traffic', 'AMap.Heatmap'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})

/**
 * @description 上传图片用url
 */
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
Vue.prototype._baseUrl = baseUrl + '/t3-admin'
/**
 * @description 时间格式化工具
 */
Vue.prototype.$moment = moment
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
