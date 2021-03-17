import axios from '@/libs/api.request'
/** 乘客基本信息*/
export const queryList = (params) => {
  return axios.request({
    url: '/admin/passenger/queryList',
    data: params,
    method: 'POST'
  })
}

/** 乘客详细信息*/
export const passengerDetail = (params) => {
  return axios.request({
    url: '/admin/passenger/queryDetail',
    data: params,
    method: 'POST'
  })
}

/** 订单记录*/
export const queryOrderList = (params) => {
  return axios.request({
    url: '/admin/passenger/queryOrderList',
    data: params,
    method: 'POST'
  })
}

/** 充值记录*/
export const queryRechargeList = (params) => {
  return axios.request({
    url: '/admin/passenger/queryRechargeList',
    data: params,
    method: 'POST'
  })
}

/** 消费记录*/
export const queryConsumptionList = (params) => {
  return axios.request({
    url: '/admin/passenger/queryConsumptionList',
    data: params,
    method: 'POST'
  })
}

/** 退款记录*/
export const queryRefundList = (params) => {
  return axios.request({
    url: '/admin/passenger/queryRefundList',
    data: params,
    method: 'POST'
  })
}

/** 优惠券信息*/
export const queryCouponList = (params) => {
  return axios.request({
    url: '/admin/passenger/listCoupon',
    data: params,
    method: 'POST'
  })
}

/** 封号记录*/
export const queryDisableAccountList = (params) => {
  return axios.request({
    url: '/admin/passenger/queryDisableAccountList',
    data: params,
    method: 'POST'
  })
}

/** 紧急联系人*/
export const queryEmergencyContactList = (params) => {
  return axios.request({
    url: '/admin/passenger/queryEmergencyContactList',
    data: params,
    method: 'POST'
  })
}

/** 行程分享记录*/
export const queryTripShareList = (params) => {
  return axios.request({
    url: '/admin/passenger/queryTripShareList',
    data: params,
    method: 'POST'
  })
}

/** 封号 */
export const block = (params) => {
  return axios.request({
    url: 'admin/passenger/block',
    data: params,
    method: 'POST'
  })
}

/** 解封 */
export const deblock = (params) => {
  return axios.request({
    url: '/admin/passenger/deblock',
    data: params,
    method: 'POST'
  })
}

/** 优惠券模板列表 */
export const templateList = (params) => {
  return axios.request({
    url: '/admin/template/list',
    data: params,
    method: 'POST'
  })
}

/** 优惠券模板新增 */
export const templateSave = (params) => {
  return axios.request({
    url: '/admin/template/save',
    data: params,
    method: 'POST'
  })
}

/** 优惠券模板修改 */
export const templateUpdate = (params) => {
  return axios.request({
    url: '/admin/template/update',
    data: params,
    method: 'POST'
  })
}

/** 优惠券模板详情 */
export const templateInfo = (params) => {
  return axios.request({
    url: '/admin/template/info',
    data: params,
    method: 'POST'
  })
}

/** 一次性发券新增 */
export const oneOffCoupon = (params) => {
  return axios.request({
    url: '/admin/coupon/grantCoupon',
    data: params,
    method: 'POST'
  })
}

/** 一次性发券记录 */
export const oneOffCouponList = (params) => {
  return axios.request({
    url: '/admin/coupon/queryRecord',
    data: params,
    method: 'POST'
  })
}

/** 一次性发券详情 */
export const oneOffCouponDetail = (params) => {
  return axios.request({
    url: '/admin/coupon/queryCoupon',
    data: params,
    method: 'POST'
  })
}

/** 一次性发券记录乘客数量查询 */
export const passengerNumber = (params) => {
  return axios.request({
    url: '/admin/coupon/count',
    data: params,
    method: 'POST'
  })
}

/** 一次性发券记录乘客详情查询 */
export const passengerMobile = (params) => {
  return axios.request({
    url: '/admin/coupon/listMobile',
    data: params,
    method: 'POST'
  })
}

/** 优惠券列表 */
export const couponList = (params) => {
  return axios.request({
    url: '/admin/coupon/list',
    data: params,
    method: 'POST'
  })
}

/** 优惠券新增 */
export const couponSave = (params) => {
  return axios.request({
    url: '/admin/coupon/save',
    data: params,
    method: 'POST'
  })
}

/** 优惠券修改 */
export const couponUpdate = (params) => {
  return axios.request({
    url: '/admin/coupon/update',
    data: params,
    method: 'POST'
  })
}

/** 优惠券详情 */
export const couponInfo = (params) => {
  return axios.request({
    url: '/admin/coupon/info/' + params,
    method: 'GET'
  })
}

/** 查询优惠券模板 */
export const templateAll = (params) => {
  return axios.request({
    url: '/admin/template/listAll',
    data: params,
    method: 'POST'
  })
}

/** 订单列表 */
export const orderList = (params) => {
  return axios.request({
    url: '/admin/order/queryOrderListByPage',
    data: params,
    method: 'POST'
  })
}

/** 订单详情 */
export const orderDetail = (params) => {
  return axios.request({
    url: '/admin/order/getOrderDetailByOrderId',
    data: params,
    method: 'POST'
  })
}

/** 订单取消 */
export const orderCancel = (params) => {
  return axios.request({
    url: '/admin/order/cancelOrder',
    params,
    method: 'POST'
  })
}

/** 订单轨迹 */
export const orderPath = (params) => {
  return axios.request({
    url: '/admin/order/queryNewOrderHistoryTrackByTime',
    data: params,
    method: 'POST'
  })
}

/** 途径点修改记录 */
export const wayRecord = (params) => {
  return axios.request({
    url: '/admin/order/queryPassingPointByOrderUuid',
    data: params,
    method: 'POST'
  })
}
/** 途径点修改记录 */
export const queryRoutePointRecord = (data) => {
  return axios.request({
    url: '/admin/order/queryRoutePointRecord',
    data,
    method: 'POST'
  })
}
/** 广告列表 */
export const advertisementPageList = (params) => {
  return axios.request({
    url: '/system/advertisement/queryAdvertisementPageList',
    params,
    method: 'GET'
  })
}

/** 新增广告 */
export const addAdvertisement = (params) => {
  return axios.request({
    url: '/system/advertisement/saveAdvertisement',
    data: params,
    method: 'POST'
  })
}

/** 关闭广告 */
export const closeAdActivity = (params) => {
  return axios.request({
    url: '/system/advertisement/closeAdActivity',
    data: params,
    method: 'POST'
  })
}

/** 广告详情 */
export const getAdByAdId = (params) => {
  return axios.request({
    url: '/system/advertisement/getAdByAdId',
    params,
    method: 'GET'
  })
}