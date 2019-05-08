/*
* 订单api接口
*/
import axios from '@/libs/api.request'

// 订单详情-获取途经点列表
export const getRoutePointRecord = (data) => {
  return axios.request({
    url: '/admin/order/routePointModifyRecord',
    data,
    method: 'post'
  })
}

// 订单详情-订单轨迹-获取规划路径数据
export const axiosPlanningPath= (data) => {
  return axios.request({
    url: '/admin/order/planningPath',
    data,
    method: 'post'
  })
}

// 订单详情-订单轨迹-获取实际路径数据
export const axiosActualTrack= (data) => {
  return axios.request({
    url: '/admin/order/actualTrack',
    data,
    method: 'post'
  })
}

// 订单详情列表
export const getOrderDetail = (data) => {
  return axios.request({
    url: '/admin/order/getOrderDetailByOrderId',
    data,
    method: 'post'
  })
} 