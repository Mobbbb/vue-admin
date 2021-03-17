/**
 * 企业用车 API
 */
import axios from '@/libs/api.request'

 /**
  * 企业用车--订单管理
  */
// 获取订单列表
export const getOrderList = (data) => {
    return axios.request({
      url: '/admin/company/order/list',
      data,
      method: 'post'
    })
}
// 新增订单
export const orderInsert = (data) => {
    return axios.request({
      url: '/admin/company/order/insert',
      data,
      method: 'post'
    })
}
// 获取订单详情
export const getCompanyOrderDetailByOrderId = (data) => {
  return axios.request({
    url: '/admin/order/getCompanyOrderDetailByOrderId',
    data,
    method: 'post'
  })
}
// 新增订单下单人列表
export const orderQueryUser = (data) => {
  return axios.request({
    url: '/admin/company/order/queryUser',
    data,
    method: 'post'
  })
}
// 选择司机
export const orderChooseDriver = (data) => {
    return axios.request({
      url: '/admin/company/order/chooseDriver',
      data,
      method: 'post'
    })
}
/**
 * 需求单--API
 */
// 获取需求单列表
export const getApplyOrderList = (data) => {
    return axios.request({
      url: '/admin/applyOrder/list',
      data,
      method: 'post'
    })
}
// 获取需求单详情
export const getApplyOrderDetail = (data) => {
    return axios.request({
      url: '/admin/applyOrder/detail',
      data,
      method: 'post'
    })
}

/**
 * 派车管理
 */

 // 派车管理列表-分页列表
export const dispatchCarQueryPage = (data) => {
  return axios.request({
    url: '/admin/dispatchCar/queryPage',
    data,
    method: 'post'
  })
}
 // 派车管理列表-详情
 export const OrderDetailByRouteUuid = (data) => {
  return axios.request({
    url: '/admin/dispatchCar/OrderDetailByRouteUuid',
    data,
    method: 'post'
  })
}
// 派车管理列表-详情-司机列表
export const queryDriverCarPage = (data) => {
  return axios.request({
    url: '/admin/dispatchCar/queryCarPage',
    data,
    method: 'post'
  })
}
// 派车管理列表-详情-派车、改派操作
export const dispatchOperation = (data) => {
  return axios.request({
    url: '/admin/dispatchCar/dispatchOperation',
    data,
    method: 'post'
  })
}

///企业钱包
//企业钱包页面中的企业分页、条件查询数据
export const walletList = (data) => {
  return axios.request({
    url: '/company/wallet/list',
    data,
    method: 'post'
  })
}
//充值记录
export const rechargeList = (data) => {
  return axios.request({
    url: '/company/wallet/recharge/list',
    data,
    method: 'post'
  })
}
//授信管理--查看
export const creditInfo = (companyId) => {
  return axios.request({
    url: `/company/wallet/credit/info/${companyId}`,
    method: 'post'
  })
}
//授信管理--编辑
export const creditEdit = (data) => {
  return axios.request({
    url: '/company/wallet/credit/edit',
    data,
    method: 'post'
  })
}
//赠款--申请
export const grantApplication = (data) => {
  return axios.request({
    url: '/company/wallet/grant/application',
    data,
    method: 'post'
  })
}
//赠款--记录
export const grantList = (data) => {
  return axios.request({
    url: '/company/wallet/grant/list',
    data,
    method: 'post'
  })
}
//退款试算查询
export const refundWallet = (companyId) => {
  return axios.request({
    url: `/company/wallet/refund/${companyId}`,
    method: 'post'
  })
}
//冻结
export const freezeWallet = (companyId) => {
  return axios.request({
    url: `/company/wallet/freeze/${companyId}`,
    method: 'post'
  })
}
