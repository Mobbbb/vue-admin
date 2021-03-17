import axios from '@/libs/api.request'
// 活动管理开始

// 新增注册活动
export const axiosRegistrationActivity = (params) => {
  return axios.request({
    url: '/sys/activity/registrationActivity',
    data: params,
    method: 'POST'
  })
}
//新增推荐乘客
export const axiosRecommendActivity = (params) => {
  return axios.request({
    url: '/sys/activity/recommendActivity',
    data: params,
    method: 'POST'
  })
}
// 新增充值活动
export const axiosRechargeActivity = (params) => {
  return axios.request({
    url: '/sys/activity/rechargeActivity',
    data: params,
    method: 'POST'
  })
}
// 新增定向发券
export const axiosDirectActivity = (params) => {
  return axios.request({
    url: '/sys/activity/directActivity',
    data: params,
    method: 'POST'
  })
}
// 新增渠道红包
export const axiosChannelRedEnvelope = (params) => {
  return axios.request({
    url: '/sys/activity/channelRedEnvelope',
    data: params,
    method: 'POST'
  })
}
// 新增行程分享
export const axiosPayRedEnvelope = (params) => {
  return axios.request({
    url: '/sys/activity/payRedEnvelope',
    data: params,
    method: 'POST'
  })
}
// 新增口令红包
export const axiosPasswordRedEnvelope = (params) => {
  return axios.request({
    url: '/sys/activity/passwordRedEnvelope',
    data: params,
    method: 'POST'
  })
}
// 新增客服发券
export const axiosCustomerServiceTicket = (params) => {
  return axios.request({
    url: '/sys/activity/customerServiceTicket',
    data: params,
    method: 'POST'
  })
}
// 新增冒泡发券
export const axiosBubblingServiceTicket = (params) => {
  return axios.request({
    url: '/sys/activity/bubblingServiceTicket',
    data: params,
    method: 'POST'
  })
}
// 新增助力活动
export const axiosHelpActityAdd = (params) => {
  return axios.request({
    url: '/sys/activity/helpActityAdd',
    data: params,
    method: 'POST'
  })
}
// 修改活动
export const axiosActivityEdit = (params) => {
  return axios.request({
    url: '/sys/activity/edit',
    data: params,
    method: 'POST'
  })
}
// 查看活动详情
export const axiosDetail = (params) => {
  return axios.request({
    url: '/sys/activity/queryActivityDetail',
    data: params,
    method: 'POST'
  })
}
// 活动列表
export const axiosPageList = (params) => {
  return axios.request({
    url: '/sys/activity/pageList',
    data: params,
    method: 'POST'
  })
}
// 终止活动
export const axiosTerminationActivity = (params) => {
  return axios.request({
    url: '/sys/activity/terminationActivity',
    data: params,
    method: 'POST'
  })
}
// 操作记录
export const axiosOperationRecord = (params) => {
  return axios.request({
    url: '/sys/activity/operationRecord',
    data: params,
    method: 'POST'
  })
}

// 优惠券模板列表
export const axiosTemplateList = (params) => {
  return axios.request({
    url: '/admin/template/list',
    data: params,
    method: 'POST'
  })
}
// 用户群管理列表
export const axiosUserGroupList = (params) => {
  return axios.request({
    url: '/admin/userGroup/list',
    data: params,
    method: 'POST'
  })
}

// 活动管理结束