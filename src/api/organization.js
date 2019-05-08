// 组织机构
import HttpRequest from '@/libs/axios'
import config from '@/config'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// 请求鉴权API用axios
const axios = new HttpRequest(baseUrl + '/auth-api/api')

// 新增组织机构
export const addOrg = (data) => {
  return axios.request({
    url: '/v1/organ/save',
    data,
    method: 'post'
  })
}

// 编辑组织机构
export const editOrg = (data) => {
  return axios.request({
    url: '/v1/organ/edit',
    data,
    method: 'post'
  })
}

// 组织机构详情
export const orgDetail = (data) => {
  return axios.request({
    url: '/v1/organ/select',
    data,
    method: 'post'
  })
}

// 删除组织机构
export const deletaOrg = (data) => {
  return axios.request({
    url: '/v1/organ/delete',
    data,
    method: 'post'
  })
}

// 查询组织机构列表
export const getOrgList = (data) => {
  return axios.request({
    url: '/v1/organ/selectAll',
    data,
    method: 'post'
  })
}
