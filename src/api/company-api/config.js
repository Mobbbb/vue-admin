import axios from '@/libs/api.request'
export const getOpenList = (data) => {
    return axios.request({
      url: '/admin/company/config/manager/cityList',
      data,
      method: 'POST'
    })
}

// 定价管理-查询企业
export const getModelsLeveList = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/companyList',
    data,
    method: 'post'
  })
}


// 定价管理-新增企业
export const addCmpany = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/addCmpany',
    data,
    method: 'post'
  })
}



// 开通管理-新增城市
export const addCity = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/addCity',
    data,
    method: 'post'
  })
}

// 开通管理 - 关闭城市
export const turnoffCity = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/updateCity',
    data,
    method: 'post'
  })
}

// 开通管理 - 开启城市
export const turnOnCity = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/updateCity',
    data,
    method: 'post'
  })
}

// 定价管理 - 关闭城市企业
export const turnoffCompany = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/updateCompanyStatus',
    data,
    method: 'post'
  })
}

// 定价管理 - 开启城市企业
export const turnOnCompany = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/updateCompanyStatus',
    data,
    method: 'post'
  })
}

// 定价管理 - 删除企业
export const deleteEnterprise = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/deleteCompany',
    data,
    method: 'post'
  })
}

// 定价管理 - 查看历史版本
export const queryHistoryVersion = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/queryHistoryVersion',
    data,
    method: 'post'
  })
}

// 定价管理 - 新增策略
export const addStrategy = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/addStrategy',
    data,
    method: 'post'
  })
}

// 定价管理 - 编辑策略
export const editStrategy = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/editStrategy',
    data,
    method: 'post'
  })
}

// 定价管理 - 策略详情
export const strategyDetail = (data) => {
  return axios.request({
    url: '/admin/company/config/manager/strategyDetail',
    data,
    method: 'post'
  })
}
// 发票管理 - 发票列表
export const invoiceList = (data) => {
  return axios.request({
    url: '/admin/finance/wallet/invoiceList',
    data,
    method: 'post'
  })
}
// 发票管理 - 发票详情
export const invoiceDetail = (data) => {
    return axios.request({
      url: '/admin/finance/wallet/invoiceDetail',
      data,
      method: 'post'
    })
  }
  // 发票管理 - 送出操作
export const transportMethod = (data) => {
    return axios.request({
      url: '/admin/finance/wallet/invoiceSendout',
      data,
      method: 'post'
    })
  }
