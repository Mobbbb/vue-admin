import axios from '@/libs/api.request'

// 共用部分开始

// 获取合作的品牌（返回值：品牌名称，uuid）
export const  axiosAllBrandList= (data) => {
  return axios.request({
    url: '/chargingPile/order/queryAllSupplier',
    data,
    method: 'post'
  })
}

// 获取供应商提供的省市区（供应商提供充电站的省市区）
export const  axiosAreaListBySupplierId= (data) => {
  return axios.request({
    url: '/charging/supplier/cityListBySupplierId',
    data,
    method: 'post'
  })
}

// 共用部分结束



// 以下为供应商管理，开始
// 获取供应商列表
export const  axiosSupplierList= (data) => {
  return axios.request({
    url: '/charging/supplier/list',
    data,
    method: 'post'
  })
}
// 新增供应商
export const  axiosAddSupplier= (data) => {
  return axios.request({
    url: '/charging/supplier/add',
    data,
    method: 'post'
  })
}
// 编辑供应商
export const  axiosEditSupplier= (data) => {
  return axios.request({
    url: '/charging/supplier/edit',
    data,
    method: 'post'
  })
}
// 停用启用供应商
export const  axiosSwitchSupplier= (data) => {
  return axios.request({
    url: '/charging/supplier/switch',
    data,
    method: 'post'
  })
}
// 以上为供应商管理，结束


// 以下为定价管理，开始

// 获取定价列表
export const  axiosPriceList= (data) => {
  return axios.request({
    url: '/charging/price/list',
    data,
    method: 'post'
  })
}
// 新增定价
export const  axiosAddPrice= (data) => {
  return axios.request({
    url: '/charging/price/add',
    data,
    method: 'post'
  })
}
// 编辑定价
export const  axiosEditPrice= (data) => {
  return axios.request({
    url: '/charging/price/edit',
    data,
    method: 'post'
  })
}
// 停启用定价
export const  axiosSwitchPrice= (data) => {
  return axios.request({
    url: '/charging/price/switch',
    data,
    method: 'post'
  })
}
// 获取含有定价的城市
export const  axiosQueryHasPriceCity= (data) => {
  return axios.request({
    url: '/charging/price/queryHasPriceCity',
    data,
    method: 'post'
  })
}
// 获取开通合作的城市
export const  axiosQueryHasCoopCity= (data) => {
  return axios.request({
    url: '/charging/city/queryHasCoopCity',
    data,
    method: 'post'
  })
}
// 获取含有定价的供应商
export const  axiosQueryHasPriceSupplier= (data) => {
  return axios.request({
    url: '/charging/price/queryHasPriceSupplier',
    data,
    method: 'post'
  })
}

// 以上为定价管理，结束

// 以下为开通城市管理，开始

// 获取城市列表
export const  axiosCityList= (data) => {
  return axios.request({
    url: '/charging/city/list',
    data,
    method: 'post'
  })
}
// 新增城市
export const  axiosAddCity= (data) => {
  return axios.request({
    url: '/charging/city/add',
    data,
    method: 'post'
  })
}
// 停启用城市
export const  axiosSwitchCity= (data) => {
  return axios.request({
    url: '/charging/city/switch',
    data,
    method: 'post'
  })
}

// 以上为开通城市管理，结束


// 以下为订单管理模块，开始
// 获取订单列表
export const  axiosOrderList= (data) => {
  return axios.request({
    url: '/chargingPile/order/list',
    data,
    method: 'post'
  })
}
// 获取订单详情
export const  axiosOrderDetail= (data) => {
  return axios.request({
    url: '/chargingPile/order/detail',
    data,
    method: 'post'
  })
}
// 以上为订单管理模块，结束


// 充电账户管理-开始

// 获取账户列表
export const  axiosAccountList= (data) => {
  return axios.request({
    url: '/chargingPile/account/list',
    data,
    method: 'post'
  })
}
// 获取司机充值记录列表
export const  axiosDriverRechargeList= (data) => {
  return axios.request({
    url: '/chargingPile/account/orderList',
    data,
    method: 'post'
  })
}

// 充电账户管理-结束


// 充电站管理-开始

// 获取充电站列表
export const  axiosStationList= (data) => {
  return axios.request({
    url: '/charger/station/list',
    data,
    method: 'post'
  })
}
// 获取供应商列表信息
export const  axiosAllSupplier= (data) => {
  return axios.request({
    url: '/charging/supplier/getAllSupplier',
    data,
    method: 'post'
  })
}
// 获取充电站详情信息
export const  axiosStationDetail= (data) => {
  return axios.request({
    url: '/charger/station/detail',
    data,
    method: 'post'
  })
}
// 获取充电站详情中的充电桩列表
export const  axiosStationPileList= (data) => {
  return axios.request({
    url: '/charger/pile/list',
    data,
    method: 'post'
  })
}
// 把充电站信息从供应商数据库拉倒我们库里
export const  axiosSynStationData= (data) => {
  return axios.request({
    url: '/charger/station/synchronizationData',
    data,
    method: 'post'
  })
}

// 充电站管理-结束
// 以上为定价管理，结束

// 下面是充电站管理  STARING

// 充电站地图
export const stationMap= (data) => {
  return axios.request({
    url: '/charger/station/map',
    data,
    method: 'post'
  })
}
// 充电站列表
export const stationList= (data) => {
  return axios.request({
    url: '/charger/station/list',
    data,
    method: 'post'
  })
}
// 充电站详情
export const stationDetail= (data) => {
  return axios.request({
    url: '/charger/station/detail',
    data,
    method: 'post'
  })
}
// 充电桩列表
export const stationPileList= (data) => {
  return axios.request({
    url: '/charger/station/pile/list',
    data,
    method: 'post'
  })
}
// 根据充电站名称模糊搜索充电站名称
export const stationQueryName= (data) => {
  return axios.request({
    url: '/charger/station/queryName',
    data,
    method: 'post'
  })
}
// 查询所有供应商信息接口
export const supplierGetAllSupplier= (data) => {
  return axios.request({
    url: '/charging/supplier/getAllSupplier',
    data,
    method: 'post'
  })
}
// 上面是充电站管理  ENDING
