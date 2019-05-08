let sendMap = {
  0: '车机'
}
let carDriverMap = {
  4: '指定运营商',
  8: '指定车辆',
  9: '批量'
}
export const tableTitle = [
   {
    title: '发送范围',
    key: 'carDriver',
    tooltip: true,
    render: (h, params)=>{
      return h('span', {
        domProps:{
          textContent: carDriverMap[params.row.carDriver]
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
    title: '发送时间',
    key: 'createTime',
    tooltip: true
  },
  {
    title: '创建者',
    key: 'createdBy',
    tooltip: true
  },
  {
    title: '发送对象',
    key: 'sendObject',
    tooltip: true,
    render: (h, params) =>{
      return h('span', '车机')
    }
  }
]
export const pageData = {
  sendDate: '',
  isNotloading: false,
  exportMsgUrl: '/carDriver/exportVehicleList',
  sendRole: '车机',
  isLoading: false,
  isShowModal: false,
  isDetail:false,
  scopeId: 1,
  modalTitle:'新建消息',
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
  operatorGroup: [],
}

export const inputList = [
  {
    name: 'date',
    bind_key: 'createTime',
    placeholder: '请选择',
    value: '',
    titleWidth: 70,
    title: '发送日期：',
    inputWidth: 200,
    unicode: '2',
    isHide: false
  },
]