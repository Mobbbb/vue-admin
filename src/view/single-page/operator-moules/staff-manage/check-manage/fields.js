/* 审批管理 */
let leaveTypeMap = {
  1: "事假",
  2: "病假",
  3: "正常休息"
}
let approvalStatusMap = {
  1: "待审批",
  2: "审批通过",
  3: "审批不通过"
}
export const fields = {
  cityName: {
      title: '所属城市',
      key: 'cityName',
      ellipsis: true,
      fixed: 'left',
      width: 100
  },
  agentName: {
    title: '所属运营商',
    key: 'agentName',
    ellipsis: true,
    width: 100
  },
  driverName: {
      title: '司机姓名',
      key: 'driverName',
      ellipsis: true,
      width: 160
  },
  driverMobile: {
      title: '司机电话',
      key: 'driverMobile',
      ellipsis: true,
      width: 160
  },
  driverUniqueNo: {
      title: '司机编号',
      key: 'driverUniqueNo',
      ellipsis: true,
      width: 160
  },
  leaveType: {
      title: '请假类型',
      key: 'leaveType',
      ellipsis: true,
      width: 160,
      render: (h, params)=>{
        return h('span',{},
        leaveTypeMap[params.row.leaveType]
        )
      }
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
  days: {
    title: '请假天数',
    key: 'days',
    ellipsis: true,
    width: 160
  },
  reason: {
    title: '请假原因',
    key: 'reason',
    ellipsis: true,
    width: 160
  },
  applyDate: {
    title: '申请时间',
    key: 'applyDate',
    ellipsis: true,
    width: 160
  },
  approvalStatus: {
    title: '审批状态',
    key: 'approvalStatus',
    ellipsis: true,
    width: 160,
    render:(h, params)=>{
      return h('span',{}, 
      approvalStatusMap[params.row.approvalStatus]
      )
    }
  },
  comment: {
    title: '备注',
    key: 'comment',
    ellipsis: true,
    width: 160
  }
};

export const pageData = {
  isLoading: false,
  isShowOutlets: false,
  isShowMore: false,
  isShowDetailModal: false,
  isPending: false,// 是否是待审批状态
  detailFormData:{},
  validTime: '',
  driverUuid: '',
  currentMessage: '同意请假申请',
  commonFormData: {},
  queryAjaxPramas: {},
  operateRule: {
    comment: [{ required: true, message: '必填'}]
  },
  searchData: {},
  outletsTitle: '通过审批',
  total: 0,
  current: 1,
  pageSize: 10,
  customList: {...fields},
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableColumnsChecked: Object.keys(fields),
  tableData: []
}