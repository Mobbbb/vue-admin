const COMMON_MAP = {
  listProvinceCityData: {
    "success":true, 
    "data": [
      {
        provinceID: 'zhejiang',
        province: '浙江',
        nodes: [{
          cityID: 'hangzhou',
          city: '杭州',
        }]
      }, 
      {
        provinceID: 'jiangsu',
        province: '江苏',
        nodes: [{
          cityID: 'nanjing',
          city: '南京',
        }]
      }
    ]
  },
  operatorListData: {
    "msg":"",
    "code":200,
    "data": [{
        uuid: 'zhejiang',
        title: '浙江',
        children: [{
          uuid: 'hangzhou',
          title: '杭州',
          children: [{
              uuid: 'xihu',
              title: '西湖',
              code: 310000
          }]
        }]
    }, 
    {
      uuid: 'jiangsu',
      title: '江苏',
      children: [{
        uuid: 'nanjing',
        title: '南京',
        children: [{
            uuid: 'zhonghuamen',
            title: '中华门',
            code: 210000
        }]
      }]
    }],
    "success":true
  }
}

export const getProvinceCityList = req => {
  return COMMON_MAP.listProvinceCityData
}

export const getCityOperatorTree = req => {
  return COMMON_MAP.operatorListData
}
