/**
 * 消息中心-公告、push 接口
 */

import axios from '@/libs/api.request'

// 获取公告列表
export const getAnnounceList = (data) => {
  return axios.request({
    url: '/system/notice/pageList',
    method: 'post',
    data: data
  })
}

// 新增公告
export const addAnnounce = (data) => {
  return axios.request({
    url: '/system/notice/insert',
    method: 'post',
    data: data
  })
}

// 撤销公告
export const deleteAnnounce = (data) => {
  return axios.request({
    url: '/system/notice/editStatus',
    method: 'post',
    data: data
  })
}

// push分页查询
export const getPushlist = (data) => {
  return axios.request({
    url: '/admin/system/push/list',
    method: 'post',
    data: data
  })
}

// 获取push详情
export const getPushDetail = (data) => {
  return axios.request({
    url: '/admin/system/push/get',
    method: 'post',
    data: data
  })
}

//新增push
export const addPush = (data) => {
  return axios.request({
    url: '/admin/system/push/add',
    method: 'post',
    data: data
  })
}
//放弃推送
export const cancelPush  = (data) => {
  return axios.request({
    url: '/admin/system/push/edit',
    method: 'post',
    data: data
  })
}

//push模糊搜索
export const remoteSearch  = (data) => {
  return axios.request({
    url: '/admin/system/push/listPushTitle',
    method: 'post',
    data: data
  })
}

//新增IM消息模板
export const addIM = (data) => {
  return axios.request({
    url: '/admin/system/imTemplet/add',
    method: 'post',
    data: data
  })
}

//查询IM列表信息
export const getIMList = (data) => {
  return axios.request({
    url: '/admin/system/imTemplet/list',
    method: 'post',
    data: data
  })
}

//编辑IM消息模板
export const editIMItem = (data) => {
  return axios.request({
    url: '/admin/system/imTemplet/update',
    method: 'post',
    data: data
  })
}

//删除IM模板信息
export const deleteImItem = (data) => {
  return axios.request({
    url: '/admin/system/imTemplet/del',
    method: 'post',
    data: data
  })
}