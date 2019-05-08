export const sendMap = {
  0: '乘客',
  1: '司机',
  2: '车机',
  3: '运营商'
}
export const sendRange = {
  0: '运营系统',
  1: '运营商系统',
  2: '车管',
  3: '司管'
}
export const driverMap = {// 发送范围 胡宏昌定义
  2: '指定乘客',
  3: '指定司机',
  4: '指定运营商',
  5: '乘客批量',
  6: '乘客指定条件',
  7: '司机批量'
}
export const tableTitle = [
   {
    title: '发送对象',
    key: 'sendName',
    tooltip: true,
    render:(h, params) => {
      return h('span', {
        domProps: {
          textContent: sendMap[params.row.sendName]
        }
      })
    }
  },
  {
    title: '发送内容',
    key: 'contents',
    tooltip: true
  },
  {
    title: '发送范围',
    key: 'driver',
    tooltip: true,
    render:(h, params) => {
      let text = driverMap[params.row.driver]
      if (!driverMap.hasOwnProperty(params.row.driver)) {
        text = params.row.driver;
      }
      return h('span', text)
    }
  },
  {
    title: '发送时间',
    key: 'createTime',
    tooltip: true
  }
]
export const pageData = {
  createdOn: '',
  exportListUrl: '',
  isShowDetail:false,
  isNotloading: false,
  detailMessageObj: [],
  batchNo: '',
  isLoading: false,
  isDetail: false,
  modalTitle: '新建消息',
  isShowModal: false,
  scopeId: 1,
  roleId: 1,
  searchData: {},
  queryAjaxPramas: {},
  addMessageObj: {},
  businessTypes: [
    {
      text: '出租车',
      value: 1
    },
    {
      text: '专车',
      value: 2
    },
    {
      text: '跨域',
      value: 3
    },
    {
      text: '快车',
      value: 4
    }
  ],
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableData: [],
  operatorGroup:[]
}

export const inputList = [
  {
    name: 'drop-input',
    bind_key: 'sendName',
    placeholder: '请选择',
    value: '',
    dropList: [
      {
        value: 0,
        label: '乘客'
      },
      {
        value: 1,
        label: '司机'
      }
    ],
    title: '发送对象：',
    inputWidth: 200,
    titleWidth: 70,
    unicode: '1',
    isHide: false
  },
  {
    name: 'date-input',
    bind_key: ['startTime', 'endTime'],
    placeholder: '请选择',
    value: '',
    titleWidth: 70,
    title: '发送日期：',
    inputWidth: 200,
    unicode: '2',
    isHide: false
  },
]