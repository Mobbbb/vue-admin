import axios from '@/libs/api.request'

// 查询所有企业信息
export const getCompanys = (data) => {
    return axios.request({
      url: '/admin/company/config/manager/queryCompanyByName',
      data: {enteroriseName: ''},
      method: 'post'
    })
  }
  // 查询所有企业信息
export const getCityList = (data) => {
    return axios.request({
      url: '/admin/company/config/manager/listOpenedCitys',
      data,
      method: 'post'
    })
  }
export const getExpress = (data)=>{
    return axios.request({
        url: '/admin/finance/wallet/getExpress',
        data,
        method: 'post'
    })
}