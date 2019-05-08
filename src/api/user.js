import HttpRequest from '@/libs/axios'
import config from '@/config/index'
import qs from 'qs'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// 登录用axios
const loginAxios = new HttpRequest(baseUrl)
// 请求鉴权API用axios
const axios = new HttpRequest(baseUrl + '/auth-api/api')

export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password: password,
    grant_type: 'password',
    scope: 'all'
  }
  return loginAxios.request({
    url: '/security-authentication-api/oauth/login',
    data: qs.stringify(data),
    method: 'post',
    headers: {
      'Authorization': 'Basic dDMtbWFuYWdlcjp0UXNwNUZMZWJBYWdDMjFO',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
}

export const getNavList = () => {
  return axios.request({
    url: '/auth/resource/queryResourceByAccountId',
    data: {
      systemId: 5
    },
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/v1/staff/selectLoginStaffInfo',
    token,
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/mock_logout',
    method: 'get'
  })
}

export const changePwd = (parameter) => {
  return axios.request({
    url: '/sys/usr/changePwd',
    data: parameter,
    method: 'post'
  })
}
