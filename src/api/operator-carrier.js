/**
 * 营运管理中心-运营商管理 接口
 */

import axios from '@/libs/api.request'

/**
 * 运营商列表
 */
export const getCarrierList = (data) => {
  return axios.request({
    url: '/admin/sysAgent/queryAgentPageList',
    method: 'post',
    data: data
  })
}

/**
 * 新增运营商
 */
export const addCarrier = (data) => {
  return axios.request({
    url: '/admin/sysAgent/save',
    method: 'post',
    data: data
  })
}

/**
 * 获取组织机构列表
 */
export const getAllOrgan = (data) => {
  return axios.request({
    url: '/admin/sysAgent/getAllOrgan',
    method: 'post',
    data: data
  })
}

/**
 * 根据运营商id获取运营商信息
 */
export const getCarrierInfo = (data) => {
  return axios.request({
    url: '/admin/sysAgent/getAgentById',
    method: 'post',
    data: data
  })
}

/**
 * 编辑运营商
 */
export const editCarrier = (data) => {
  return axios.request({
    url: '/admin/sysAgent/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除运营商
 */
export const deleteCarrier = (data) => {
  return axios.request({
    url: '/admin/sysAgent/delete',
    method: 'post',
    data: data
  })
}

/**
 * 司管列表
 */
export const driverMList = (data) => {
  return axios.request({
    url: '/manager/driver/manager/list',
    method: 'post',
    data: data
  })
}

/**
 * 编辑司管状态
 */
export const updateDriverM = (data) => {
  return axios.request({
    url: '/manager/driver/manager/updateSelective',
    method: 'post',
    data: data
  })
}

/**
 * 司机列表
 */
export const driverList = (data) => {
  return axios.request({
    url: '/manager/driver/manager/driver/list',
    method: 'post',
    data: data
  })
}

/**
 * 根据条件获取司机列表
 */
export const getDriverListByDriverM = (data) => {
  return axios.request({
    url: '/manager/driver/manager/listOrtherAgenDriverForPage',
    method: 'post',
    data: data
  })
}

/**
 * 分配司机
 */
export const tranferDriver = (data) => {
  return axios.request({
    url: '/manager/driver/manager/insertManagerDriverRelation',
    method: 'post',
    data: data
  })
}

/**
 * 考核规则
 */
export const rulesInfo = (data) => {
  return axios.request({
    url: '/admin/sysAgent/assessment/rules',
    method: 'post',
    data: data
  })
}

/**
 * 编辑考核规则
 */
export const updateRules = (data) => {
  return axios.request({
    url: '/admin/sysAgent/assessment/rules/update',
    method: 'post',
    data: data
  })
}

/**
 * 抽成管理列表
 */
export const getDrpList = (data) => {
  return axios.request({
    url: '/admin/regional/agentCommision/list',
    method: 'post',
    data: data
  })
}

/**
 * 新增抽成
 */
export const addDrp = (data) => {
  return axios.request({
    url: '/admin/regional/agentCommision/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除抽成
 */
export const deleteDrp = (data) => {
  return axios.request({
    url: '/admin/regional/agentCommision/remove',
    method: 'post',
    data: data
  })
}

/**
 * 抽成详情
 */
export const drpDetail = (data) => {
  return axios.request({
    url: '/admin/regional/agentCommision/info',
    method: 'post',
    data: data
  })
}

/**
 * 编辑抽成
 */
export const updateDrp = (data) => {
  return axios.request({
    url: '/admin/regional/agentCommision/update',
    method: 'post',
    data: data
  })
}

/**
 * 补贴管理列表
 */
export const getSubsidyList = (data) => {
  return axios.request({
    url: '/admin/regional/agentSubsidy/list',
    method: 'post',
    data: data
  })
}

/**
 * 新增补贴
 */
export const addSubsidy = (data) => {
  return axios.request({
    url: '/admin/regional/agentSubsidy/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除补贴
 */
export const deleteSubsidy = (data) => {
  return axios.request({
    url: '/admin/regional/agentSubsidy/remove',
    method: 'post',
    data: data
  })
}

/**
 * 补贴详情
 */
export const subsidyDetail = (data) => {
  return axios.request({
    url: '/admin/regional/agentSubsidy/info',
    method: 'post',
    data: data
  })
}

/**
 * 编辑补贴
 */
export const updateSubsidy = (data) => {
  return axios.request({
    url: '/admin/regional/agentSubsidy/update',
    method: 'post',
    data: data
  })
}

/**
 * 补贴管理-不可选年月查询
 */
export const getExistSMonths = (data) => {
  return axios.request({
    url: '/admin/regional/agentSubsidy/getExistMonths',
    method: 'post',
    data: data
  })
}

/**
 * 抽成管理-不可选年月查询
 */
export const getExistDrpMonths = (data) => {
  return axios.request({
    url: '/admin/regional/agentCommision/getExistMonths',
    method: 'post',
    data: data
  })
}

/**
 * 考核结果查看
 */
export const checkResult = (data) => {
  return axios.request({
    url: '/admin/sysAgent/assessment/result',
    method: 'post',
    data: data
  })
}

/**
 * 运营商实时数据
 */
export const carrierRealtimeData = (data) => {
  return axios.request({
    url: '/admin/sysAgent/getRealtimeDataByAgent',
    method: 'post',
    data: data
  })
}

/**
 * 运营商统计数据
 */
export const carrierLineData = (data) => {
  return axios.request({
    url: '/admin/sysAgent/getStatisticalDataByAgent',
    method: 'post',
    data: data
  })
}

/**
 * 获取车管列表
 */
export const getCarManagerList = (data) => {
  return axios.request({
    url: '/admin/carManager/queryVehicleManagementListByPage',
    method: 'post',
    data: data
  })
}

/**
 * 更改车管状态
 */
export const updateCarManagerStatus = (params) => {
  return axios.request({
    url: '/admin/carManager/updateVehicleManagementStatus',
    method: 'get',
    params
  })
}

/**
 * 编辑车管
 */
export const updateCarManager = (data) => {
  return axios.request({
    url: '/admin/carManager/updateVehicleManagement',
    method: 'post',
    data: data
  })
}

