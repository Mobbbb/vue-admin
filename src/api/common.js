import axios from '@/libs/api.request'

/** 获取司机姓名 */
export const getDriverName = (data) => {
  return axios.request({
    url: '/admin/driver/names',
    data,
    method: 'post'
  })
}

/** 获取车型 */
export const getCarModel = (data) => {
  return axios.request({
    url: '/admin/driver/models',
    data,
    method: 'post'
  })
}

/** 获取车牌号 */
export const getCarNoList = (data) => {
  return axios.request({
    url: '/admin/driver/plateNums',
    data,
    method: 'post'
  })
}

/** 用户表头设置 */
export const setTableTitle = (data) => {
  return axios.request({
    url: '/sys/usr/table/settings',
    data,
    method: 'post'
  })
}

/** 获取用户设置的表头 */
export const getTableTitle = (data) => {
  return axios.request({
    url: '/sys/usr/table/settingListData',
    data,
    method: 'post'
  })
}
 
// 获取全国省、市级联列表
export const getWholeRegion = (data) => {
  return axios.request({
    url: '/common/citys',
    data,
    method: 'post'
  })
}

// 获取开通城市，同级的市列表
export const getCitys = (data = {}) => {
  return axios.request({
    url: '/common/listCityData',
    data,
    method: 'post'
  })
}

// 获取已开通省、市级联列表
export const getProvinceCityList = (data = {}) => {
  return axios.request({
    url: '/common/listProvinceCityData',
    data: data,
    method: 'post'
  })
}

// 获取带省、市、运营商级联列表
export const getCityOperatorTree = () => {
  return axios.request({
    url: '/carDriver/operatorList',
    method: 'get'
  })
}

// 获取同级运营商列表 
export const getAgentList = (data) => {
  return axios.request({
    url: '/admin/driver/agents',
    data,
    method: 'post'
  })
}