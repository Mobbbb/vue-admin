import axios from '@/libs/api.request'

//获取车辆列表
export const getVehicleList = (data) => {
  return axios.request({
    url: 'admin/carManager/list',
    data,
    method: 'post'
  })
}

export const getVehicleBasic = (data) => {
  return axios.request({
    url: 'admin/carManager/detailInfo',
    data,
    method: 'post'
  })
}

export const getAuthorizedDriver = (data) => {
  return axios.request({
    url: 'admin/carManager/authorizedDriver',
    data,
    method: 'post'
  })
}

export const getViolationRecord = (data) => {
  return axios.request({
    url: 'admin/carManager/violationRecord',
    data,
    method: 'post'
  })
}
export const getOrderList = (data) => {
  return axios.request({
    url: 'admin/carManager/orderList',
    data,
    method: 'post'
  })
}
export const exportCars = (data) => {
  return axios.request({
    url: 'admin/carManager/exportCars',
    data,
    method: 'post'
  })
}

export const getDriverWholeName = (data) => {
  return axios.request({
    url: 'admin/carManager/getDriverName',
    data,
    method: 'post'
  })
}

//司机授权
export const handleDriverAuth = (data) => {
  return axios.request({
    url: 'admin/carManager/authDriver',
    data,
    method: 'post'
  })
}

//历史使用人
export const getHistoricalUser = (data) => {
  return axios.request({
    url: 'admin/carManager/historicalUser',
    data,
    method: 'post'
  })
}

//实时车况
export const getRealTimeStatus= (data) => {
  return axios.request({
    url: 'admin/carManager/realTimeStatus',
    data,
    method: 'post'
  })
}
//车辆编辑/基本信息
export const saveBaceInfo = (data) => {
  return axios.request({
    url: 'admin/carManager/editCarBaceInfo',
    data,
    method: 'post'
  })
}

//车辆编辑/行驶证信息

export const saveDrivingLicense = (data) => {
  return axios.request({
    url: 'admin/carManager/editCarDrivingLicense',
    data,
    method: 'post'
  })
}

// 车辆编辑/运营信息
export const saveOperationInfo = (data) => {
  return axios.request({
    url: 'admin/carManager/editCarOperationInfo',
    data,
    method: 'post'
  })
}

// 车辆编辑/保险信息
export const saveInsuranceInfo = (data) => {
  return axios.request({
    url: 'admin/carManager/editCarInsuranceInfo',
    data,
    method: 'post'
  })
}

// 车辆编辑/购置信息
export const savePurchaseInfo = (data) => {
  return axios.request({
    url: 'admin/carManager/editCarPurchaseInfo',
    data,
    method: 'post'
  })
}

// 车辆编辑/上牌信息
export const saveBoardInfo = (data) => {
  return axios.request({
    url: 'admin/carManager/editCarBoardInfo',
    data,
    method: 'post'
  })
}

// 车辆编辑/软装信息
export const saveInteriorInfo = (data) => {
  return axios.request({
    url: 'admin/carManager/editCarInteriorInfo',
    data,
    method: 'post'
  })
}

// 车辆编辑/硬件信息
export const saveHardwareInfo = (data) => {
  return axios.request({
    url: 'admin/carManager/editCarHardwareInfo',
    data,
    method: 'post'
  })
}
// 车辆编辑/其它
export const saveOtherInfo = (data) => {
  return axios.request({
    url: 'admin/carManager/editCarOtherInfo',
    data,
    method: 'post'
  })
}
// 获取所有车型 @params brandId
export const getBrandList = (params) => {
  return axios.request({
    url: 'config/model/queryCarModelByBrandId',
    params,
    method: 'get'
  })
}
//远程控制
export const controlCar = (data) => {
  return axios.request({
    url: 'admin/carManager/controlCar',
    data,
    method: 'post'
  })
}