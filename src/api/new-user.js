import axios from '@/libs/api.request'

export const login = (params) => {
  return axios.request({
    url: '/login',
    data: params,
    method: 'post'
  })
}