/** 司机运营状态 */
const operationStatus = {
  1: '已下线',
  2: '听单中',
  3: '行程中',
  4: '强制下线'
}
/* 司机端运营管理 */
export const fields = {
  name: {
      title: '姓名',
      key: 'name',
      ellipsis: true,
      fixed: 'left',
      width: 100
  },
  driverNo: {
    title: '司机ID',
    key: 'driverNo',
    ellipsis: true,
    width: 100
  },
  mobile: {
      title: '手机号',
      key: 'mobile',
      ellipsis: true,
      width: 160
  },
  plateNum: {
      title: '车牌号',
      key: 'plateNum',
      ellipsis: true,
      width: 160
  },
  csmMoney: {
      title: '余额',
      key: 'csmMoney',
      ellipsis: true,
      width: 160
  },
  modelName: {
      title: '车型',
      key: 'modelName',
      ellipsis: true,
      width: 160
  },
  city: {
      title: '城市',
      key: 'city',
      ellipsis: true,
      width: 160
  },
  onlineDuration: {
    title: '在线时间(分钟)',
    key: 'onlineDuration',
    ellipsis: true,
    width: 160
  },
  startTime: {
    title: '开始时间',
    key: 'startTime',
    ellipsis: true,
    width: 160
  },
  endTime: {
    title: '结束时间',
    key: 'endTime',
    ellipsis: true,
    width: 160
  },
  peakDuration: {
    title: '高峰时长',
    key: 'peakDuration',
    ellipsis: true,
    width: 160
  },
  arrivalFare: {
    title: '到账金额(元)',
    key: 'arrivalFare',
    ellipsis: true,
    width: 160
  },
  finshTotal: {
    title: '总完成订单',
    key: 'finshTotal',
    ellipsis: true,
    width: 160
  },
  finshRate: {
    title: '总成单率(%)',
    key: 'finshRate',
    ellipsis: true,
    width: 160
  },
  realFinshTotal: {
    title: '实时成单量',
    key: 'realFinshTotal',
    ellipsis: true,
    width: 160
  },
  preFinshTotal: {
    title: '预约单成单量',
    key: 'preFinshTotal',
    ellipsis: true,
    width: 160
  },
  preRate: {
    title: '预成单率(%)',
    key: 'preRate',
    ellipsis: true,
    width: 160
  },
  realRate: {
    title: '实时单率(%)',
    key: 'realRate',
    ellipsis: true,
    width: 160
  },
  status: {
      title: '状态',
      key: 'status',
      ellipsis: true,
      width: 160,
      render: (h, params)=> {
        return h('span', {
          domProps: {
            textContent: operationStatus[params.row.status]
          }
        })
      }
  },
  agentName: {
      title: '运营商',
      key: 'agentName',
      ellipsis: true,
      width: 160
  }
};

export const pageData = {
  isLoading: false,
  isShowOutlets: false,
  isShowMore: false,
  validTime: '',
  commonFormData: {},
  queryAjaxPramas: {},
  operateRule: {
    operateRemark: [{ required: true, message: '必填'}]
  },
  searchData: {},
  outletsTitle: '强制下线',
  total: 0,
  current: 1,
  pageSize: 10,
  customList: {...fields},
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableColumnsChecked: ['name', 'mobile', 'plateNum','preFinshTotal', 'onlineDuration', 'realFinshTotal','finshTotal',
   'modelName', 'city', 'status', 'agentName', 'preRate','driverNo'],
  tableData: []
}