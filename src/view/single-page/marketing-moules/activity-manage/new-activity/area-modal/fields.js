
// tableb表头信息
let parColumns = [
  {
    type: 'index',
    width: 60,
    align: 'center'
  },
  {
    title: '名称',
    key: 'name',
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: '城市',
    key: 'cityName',
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: '业务类型',
    key: 'type',
    ellipsis: true,
    tooltip: true,
    minWidth: 80,
    render: (h, params) => {
      let newtitles = ''
      switch (params.row.serviceType) {
        case 4:
          newtitles = '快车';
          break;
        case 2:
          newtitles = '专车';
          break;
        case 1:
          newtitles = '出租车';
          break;
        default:
          newtitles = '暂无';
      }
      return h('div', newtitles)
    }
  }
]

export const cacheData = {
  pageObj: {
    total: 100,
    current: 1,
    pageSize: 10
  },
  parColumns,
  tableData: [],
  selectedObj: {}
}