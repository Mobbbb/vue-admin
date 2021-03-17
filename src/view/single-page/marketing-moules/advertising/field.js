export const defaultData = {
  searchData: {},
  total: 0,
  current: 1,
  pageSize: 15,
  pageOpts: [15, 30, 45, 60],
  range: [...Array(11).keys()],
  dataList: [], // 主页接口数据
  formInline: {
    picLinkList:[{
      adPicture: '',
      adLink: ''
    }],
    cityRelationList: [],
    type: 1
  },
  cityName:{
    1: '全国所有城市',
    2: '全部已开通城市'
  },
  adStatusMap:{ // 广告状态
    1: '未开始',
    2: '在线中',
    3: '已结束',
    4: '已关闭'
  }
}