/* 审批管理 */
let leaveTypeMap = {
  1: "事假",
  2: "病假",
  3: "正常休息"
}
let approvalStatusMap = {
  1: "待审批",
  2: "通过",
  3: "驳回"
}
export const fields = {
  cityName: {
    title: '所属城市',
    key: 'cityName',
    tooltip: true,
    width: 100,
    fixed: 'left'
  },
  agentName: {
    title: '所属运营商',
    key: 'agentName',
    tooltip: true,
    width: 100
  },
  driverName: {
    title: '司机姓名',
    key: 'driverName',
    tooltip: true,
    width: 160
  },
  driverMobile: {
    title: '司机电话',
    key: 'driverMobile',
    tooltip: true,
    width: 160
  },
  driverNo: {
    title: '司机编号',
    key: 'driverNo',
    tooltip: true,
    width: 160
  },
  leaveType: {
    title: '请假类型',
    key: 'leaveType',
    tooltip: true,
    width: 160,
    render: (h, params)=>{
      return h('span',{},
        leaveTypeMap[params.row.leaveType]
      )
    }
  },
  startTime: {
    title: '开始时间',
    key: 'startTimeStr',
    tooltip: true,
    minWidth: 160
  },
  endTime: {
    title: '结束时间',
    key: 'endTimeStr',
    tooltip: true,
    minWidth: 160
  },
  days: {
    title: '请假天数',
    key: 'days',
    tooltip: true,
    width: 160
  },
  reason: {
    title: '请假原因',
    key: 'reason',
    tooltip: true,
    width: 160
  },
  applyDate: {
    title: '申请时间',
    key: 'applyDate',
    tooltip: true,
    width: 160
  },
  approvalStatus: {
    title: '审批状态',
    key: 'approvalStatus',
    tooltip: true,
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
    tooltip: true,
    width: 160
  }
};

export const pageData = {
  isLoading: false,
  isShowOutlets: false,
  isShowMore: false,
  isShowDetailModal: false,
  isPending: false,// 是否是待审批状态
  detailFormData: {},
  currentMessage: '同意请假申请',
  commonFormData: {},
  queryAjaxPramas: {},
  operateRule: {
    comment: [{ required: true, message: '必填'}]
  },
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

export const inputList = [
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'name', // 返回数据的key名
    placeholder: '请输入司机姓名',
    value: '', // 用于数据绑定
    title: '司机姓名：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'driverNo', // 返回数据的key名
    placeholder: '请输入司机编号',
    value: '', // 用于数据绑定
    title: '司机编号：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'mobile', // 返回数据的key名
    placeholder: '请输入手机号',
    value: '', // 用于数据绑定
    title: '手机号：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'cascader-input', // 文本输入框名
    bind_key: ['provinceId1', 'cityUuid'], // 返回数据的key名
    placeholder: '请选择省/市',
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: '省 / 市：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '666', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false, // false: 不隐藏 / true: 隐藏
    changeOnSelect: true
  },
  {
    name: 'cascader-input', // 文本输入框名
    bind_key: ['provinceId2', 'cityId', 'agentUuid'], // 返回数据的key名
    placeholder: '请选择运营商',
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: '运营商：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '666', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false, // false: 不隐藏 / true: 隐藏
    changeOnSelect: true
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'approvalStatus', // 返回数据的key名
    placeholder: '请选择审批状态',
    value: '', // 用于数据绑定
    title: '审批状态：', // 展示的字段名
    dropList: [
      {
          label: '待审批',
          value: 1
      },
      {
          label: '通过',
          value: 2
      },
      {
          label: '驳回',
          value: 3
      }
    ],
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'leaveType', // 返回数据的key名
    placeholder: '请选择请假类型',
    value: '', // 用于数据绑定
    title: '请假类型：', // 展示的字段名
    dropList: [
      {
          label: '事假',
          value: 1
      },
      {
          label: '病假',
          value: 2
      },
      {
          label: '正常休息',
          value: 3
      }
    ],
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'date-input', // 文本输入框名
    bind_key: ['applyStartTime', 'applyEndTime'], // 返回数据的key名
    placeholder: '请选择考勤日期',
    value: '', // 用于数据绑定
    title: '申请时间：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  }
]