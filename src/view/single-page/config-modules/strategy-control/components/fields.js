// 系统策略表格控制
export const serviceTypeMap = {
  1: '出租车',
  2: '专车',
  4: '快车'
}
let orderTypeMap = {
  1:'实时',
  2:'预约',
}
let statusMap = {
  '1':'生效中',
  '-2':'已失效',
  '0':'未开始',
}
let statusList = [
  {
    value: 1,
    label: '生效中'
  },
  {
    value: -2,
    label: '已失效'
  },
  {
    value: 0,
    label: '未开始'
  }
]
// 业务线
let businessTypeList = [
  {
    value: 1,
    label: '快车'
  },
  {
    value: 2,
    label: '专车'
  },
  {
    value: 3,
    label: '出租车'
  }
]
let index = {
  title: '序号',
  type: 'index',
  width: 60,
  align: 'center'
}
let cityName = {
  title: '适用城市',
  key: 'cityName',
  tooltip: true,
  minWidth: 100
}
let typeTime = {
  title: '订单类型',
  key: 'typeTime',
  tooltip: true,
  minWidth: 120,
  render: (h, params) => {
    return h('div', orderTypeMap[params.row.typeTime] || '')
  }
}
let strategyName = {
  title: '策略名称',
  key: 'strategyName',
  tooltip: true,
  minWidth: 170
}
let effectiveTime = {
  title: '生效时间',
  key: 'effectiveTime',
  tooltip: true,
  minWidth: 160
}
let status = {
  title: '状态',
  key: 'status',
  tooltip: true,
  minWidth: 90,
  render: (h, params) => {
    return h('div', statusMap[String(params.row.status)] || '')
  }
}
let updater = {
  title: '操作人',
  key: 'updater',
  tooltip: true,
  minWidth: 90
}
let versionName = {
  title: '版本号',
  key: 'versionName',
  tooltip: true,
  minWidth: 90
}
let serviceType = {
  title: '业务线',
  key: 'serviceType',
  ellipsis: true,
  tooltip: true,
  minWidth: 120,
  render: (h, params) => {
    return h('div', serviceTypeMap[params.row.serviceType] || '暂无')
  }
}
let divergeTime = {
  title: '偏离时限(分钟)',
  key: 'divergeTime',
  tooltip: true,
  minWidth: 100
}
let divergeNum = {
  title: '偏离次数',
  key: 'divergeNum',
  tooltip: true,
  minWidth: 100
}
let divergePercent = {
  title: '偏离里程占比',
  key: 'divergePercent',
  tooltip: true,
  minWidth: 100,
  render: (h, params) => {
    return h('div', params.row.divergePercent +' %')
  }
}
let nightServiceBeginTime = {
  title: '夜晚服务时间段',
  key: 'nightServiceBeginTime',
  tooltip: true,
  minWidth: 160,
  render: (h, params) => {
    return h('div', params.row.nightServiceEndTime?(params.row.nightServiceBeginTime + ' - ' + params.row.nightServiceEndTime):'')
  }
}
let morningPeakBeginTime = {
  title: '早高峰时段',
  key: 'morningPeakBeginTime',
  tooltip: true,
  minWidth: 160,
  render: (h, params) => {
    return h('div', params.row.morningPeakEndTime?(params.row.morningPeakBeginTime + ' - ' + params.row.morningPeakEndTime):'')
  }
}
let eveningPeakBeginTime = {
  title: '晚高峰时段',
  key: 'eveningPeakBeginTime',
  tooltip: true,
  minWidth: 160,
  render: (h, params) => {
    return h('div', params.row.eveningPeakEndTime?(params.row.eveningPeakBeginTime + ' - ' + params.row.eveningPeakEndTime):'')
  }
}
let otherPeakBeginTime = {
  title: '其他高峰时段',
  key: 'otherPeakBeginTime',
  tooltip: true,
  minWidth: 160,
  render: (h, params) => {
    return h('div', params.row.otherPeakEndTime?(params.row.otherPeakBeginTime + ' - ' + params.row.otherPeakEndTime):'')
  }
}
let detailBtn = (that,params,type)=>{
  return {
    'class': {
      tableBtn: true
    },
    props: {
      type: "info",
      ghost: true,
      size: "small"
    },
    // directives: [{
    //   name: 'hasAuth',
    //   value: 'strategy_control-detail'
    // }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          isEdit: false
        }
        that.$emit('axiosDetail',obj)
      }
    }
  }
}
let editBtn = (that,params,type)=>{
  return {
    'class': {
      tableBtn: true
    },
    props: {
      type: "success",
      ghost: true,
      size: "small"
    },
    // directives: [{
    //   name: 'hasAuth',
    //   value: 'strategy_control-detail'
    // }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type,
          isEdit: true
        }
        that.$emit('axiosDetail',obj)
      }
    }
  }
}
let deleteBtn = (that,params,type)=>{
  return {
    'class': {
      tableBtn: true
    },
    props: {
      type: "error",
      ghost: true,
      size: "small"
    },
    style: {
      display: Number(params.row.status) === 0 ? 'inline-block' : 'none'
    },
    // directives: [{
    //   name: 'hasAuth',
    //   value: 'strategy_control-detail'
    // }],
    on: {
      click: () => {
        let obj = {
          uuid: params.row.uuid,
          type: type
        }
        that.$emit('axiosDelete',obj)
      }
    }
  }
}
// 表格columns
// 取消策略
export const cancelColumns = (that)=>{
  return {
    index,
    cityName,
    typeTime,
    strategyName,
    effectiveTime,
    status,
    updater,
    versionName,
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (h, params) => {
        return h('div', [
          h('Button', detailBtn(that,params,'1'), '详情'),
          h('Button',editBtn(that,params,'1') , '编辑')
        ])
      }
    }
  }
}
// 偏离报警策略
export const deviateColumns = (that)=>{
  return {
    index,
    cityName,
    serviceType,
    strategyName,
    divergeTime,
    divergeNum,
    divergePercent,
    effectiveTime,
    status,
    updater,
    versionName,
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (h, params) => {
        return h('div', [
          h('Button', detailBtn(that,params,'2'), '详情'),
          // h('Button',editBtn(that,params,'2') , '编辑')
          h('Button',deleteBtn(that,params,'2') , '删除')
        ])
      }
    }
  }
}
// 时间段及高峰策略
export const timeColumns = (that)=>{
  return {
    index,
    cityName,
    strategyName,
    nightServiceBeginTime,
    morningPeakBeginTime,
    eveningPeakBeginTime,
    otherPeakBeginTime,
    effectiveTime,
    status,
    updater,
    versionName,
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (h, params) => {
        return h('div', [
          h('Button', detailBtn(that,params,'3'), '详情'),
          // h('Button',editBtn(that,params,'3') , '编辑')
          h('Button',deleteBtn(that,params,'3') , '删除')
        ])
      }
    }
  }
}

// 搜索列表
// 城市条件搜索
export let cityObj = {
  name: 'cascader-input', // 文本输入框名
  bind_key: ['provinceCode', 'cityCode'], // 返回数据的key名
  placeholder: '请选择省/市',
  value: [], // 绑定返回数据
  cascaderList: [], // 级联列表
  title: '省/市：', // 展示的字段名
  titleWidth: 50, // 展示的字段名的宽度
  inputWidth: 160, // input框的宽度
  key: '666', // 该文本框的唯一标识，用于匹配该文本框是否展示
  isHide: false, // false: 不隐藏 / true: 隐藏
  changeOnSelect: true
}
// 状态条件搜索
let statusObj = {
name: 'drop-input',
  bind_key: 'status',
  placeholder: '请选择状态',
  value: '',
  titleWidth: 40,
  dropList: statusList,
  title: '状态：',
  inputWidth: 120,
  unicode: '2',
  isHide: false
}
// 策略名称
let nameObj = {
name: "text-input",
bind_key: "strategyName",
placeholder: "请输入策略名称",
value: "",
title: "策略名称：",
titleWidth: 60,
inputWidth: 200, // input框的宽度
key: "6",
isHide: false
}
let cancelInputList = [
{...cityObj},
{...statusObj},
{...nameObj}
]
let deviateInputList = [
{...cityObj},
{
  name: 'drop-input',
  bind_key: 'serviceType',
  placeholder: '请选择业务线',
  value: '',
  titleWidth: 60,
  dropList: [
    {
      value: 4,
      label: '快车'
    },
    {
      value: 2,
      label: '专车'
    },
    {
      value: 1,
      label: '出租车'
    }      
  ],
  title: '业务线：',
  inputWidth: 150,
  unicode: '2',
  isHide: false
},
{...statusObj},
{...nameObj}
]
let timeInputList = [
{...cityObj},
{...statusObj},
{...nameObj}
]
let pageObj = {
total: 0,
current: 1,
pageSize: 10
}
let tableConfigData = {
isLoading: true,
inputDataList: [],
tableColumns: [], // 表格头
tableData: [], //表格数据
rootTabelData: [] // 表格元数据
}
export const cancelData = {
  searchData: {},
  inputList:cancelInputList,
  pageObj:{...pageObj},
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], //表格数据
  rootTabelData: [] // 表格元数据
}
export const deviateData = {
  searchData: {},
  inputList:deviateInputList,
  pageObj:{...pageObj},
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], //表格数据
  rootTabelData: [] // 表格元数据
}
export const timeData = {
  searchData: {},
  inputList:timeInputList,
  pageObj:{...pageObj},
  isLoading: true,
  inputDataList: [],
  tableColumns: [], // 表格头
  tableData: [], //表格数据
  rootTabelData: [] // 表格元数据
}
let tabObj = {
  tabNamePone: 'cancelTab'
}
// 日期大于当前日校验
export const validTimeRange = (rule, value, callback) => {
  if(!value[0]||!value[1]){
    callback(new Error('请选择时间范围'))
  }else {
    callback()
  }
}
// 日期大于当前日校验
export const validNowTime = (rule, value, callback) => {
  let now = new Date()
  let dataTime = new Date(value)
  if(dataTime<now){
    callback(new Error('选择时间不能小于当前时间'))
  }else {
    callback()
  }
}
// 整数校验
export const integerValidate = (rule, value, callback) => {
  if(value%1 !== 0){
    callback(new Error('请输入整数'))
  }else {
    callback()
  }
}
// 新增编辑免费取消
let cancelModelData = {
  //免费取消新增策略
  typeTime: null,//订单类型
  strategyName: "", //策略名称
  city: [], // 适用城市
  money: null,//取消费
  effectiveTime: "",
  freeCancleMinute: null,//接单后免费取消时间
  outCancleMinute: null,//接单后超时取消时间
  continuedCancelLimit: false,//连续取消次数限制
  dailyCancelLimit: false,//每日取消次数限制
  continuedCancelMinute: null,//连续取消次数限制-几分钟内
  continuedCancelNum: null,//连续取消次数限制-主动取消次数
  continuedCancelNoMinute: null,//连续取消次数限制-禁止下单分钟
  dailyCancelMinute: null,//每日取消次数限制-几分钟内
  dailyCancelNum: null,//每日取消次数限制-主动取消次数
  dailyCancelNoMinute: null,//每日取消次数限制-禁止下单分钟
  noResponseCancelMinute: null,//无责取消时间
  driverLaterMinute: null,//司机可迟到时间
}
let cancelRules = {
  typeTime: [{ required: true, type: 'number', message: "请选择订单类型" }],
  money: [
    { required: true,type:'number', message: "请填写取消费" }
  ],
  city: [{ required: true,type: 'array',trigger: 'change', message: "请选择城市" }],
  strategyName: [
    { required: true, message: "请输入策略名称" },
    { type: 'string', max: 20, message: '最多输入20个字', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/, message: '仅支持中文英文和数字', trigger: 'blur' }
  ],
  effectiveTime: [
    { required: true, message: "请选择生效时间" },
    { trigger: 'blur', validator: validNowTime },
  ],
  freeCancleMinute: [
    { required: true,type:'number', message: "请填写接单后免费取消时间" },
    { trigger: 'blur', validator: integerValidate }
  ],
  noResponseCancelMinute: [
    { required: true,type:'number', message: "请填写无责取消时间" },
    { trigger: 'blur', validator: integerValidate }
  ],
  driverLaterMinute: [
    { required: true,type:'number', message: "请填写司机可迟到时间" },
    { trigger: 'blur', validator: integerValidate }
  ],
  outCancleMinute: [
    { required: true,type:'number', message: "请填写接单后超时取消时间" },
    { trigger: 'blur', validator: integerValidate }
  ],
  continuedCancelMinute: [
    { required: true,type:'number', message: "必填" },
    { trigger: 'blur', validator: integerValidate }
  ],
  continuedCancelNum: [
    { required: true,type:'number', message: "必填" },
    { trigger: 'blur', validator: integerValidate }
  ],
  continuedCancelNoMinute: [
    { required: true,type:'number', message: "必填" },
    { trigger: 'blur', validator: integerValidate }
  ],
  dailyCancelMinute: [
    { required: true,type:'number', message: "必填" },
    { trigger: 'blur', validator: integerValidate }
  ],
  dailyCancelNum: [
    { required: true,type:'number', message: "必填" },
    { trigger: 'blur', validator: integerValidate }
  ],
  dailyCancelNoMinute: [
    { required: true,type:'number', message: "必填" },
    { trigger: 'blur', validator: integerValidate }
  ],
}
// 新增编辑偏离报警
let deviateModelData = {
  strategyName: "", //名称
  serviceType: "", //业务线
  divergeTime: null, // 偏离时限
  divergeNum: null, // //偏离次数
  divergePercent: "", //偏离里程占比
  remark: "", // 备注
  creater: "", // 创建人
  city: [], // 适用城市
  effectiveTime:""
}
let deviateRules = {
  serviceType: [{ required: true, message: "请选择业务线" }],
  divergeTime: [
    { required: true, message: "请填写偏离时限" },
    { trigger: 'change', validator: integerValidate }
  ],
  divergeNum: [
    { required: true, message: "请填写偏离次数" },
    { trigger: 'change', validator: integerValidate }
  ],
  divergePercent: [{ required: true, message: "请填写偏离里程占比" }],
  city: [{ required: true, message: "请选择城市" }],
  strategyName: [
    { required: true, message: "请输入策略名称" },
    { type: 'string', max: 20, message: '最多输入20个字', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/, message: '仅支持中文英文和数字', trigger: 'blur' }
  ],
  effectiveTime: [
    { required: true, message: "请选择生效时间" },
    { trigger: 'change', validator: validNowTime },
  ]
}
// 新增编辑时间段和高峰
let timeModelData = {
  strategyName:'',//策略名称
  city:[],//适用城市
  effectiveTime:'',//生效时间
  nightServiceBeginTime: '',//夜间服务开始时间
  nightServiceEndTime: '',//夜间服务结束时间
  morningPeakBeginTime: '',//早高峰时段开始
  morningPeakEndTime: '',//早高峰时段结束
  eveningPeakBeginTime: '',//晚高峰时段开始
  eveningPeakEndTime: '',//晚高峰时段结束
  otherPeakBeginTime: '',//其他高峰时段开始
  otherPeakEndTime: ''//其他高峰时段结束
}
let timeRules = {
  strategyName: [
    { required: true, message: "请输入策略名称" },
    { type: 'string', max: 20, message: '最多输入20个字', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/, message: '仅支持中文英文和数字', trigger: 'blur' }
  ],
  city: [{ required: true, message: "请选择城市" }],
  effectiveTime: [
    { required: true, message: "请选择时间" },
    { trigger: 'change', validator: validNowTime },
  ],
  nightServiceBeginTime:[
    { required: true, message: "请选择夜间服务开始时段" }
  ],
  nightServiceEndTime:[
    { required: true, message: "请选择夜间服务结束时段" }
  ],
  morningPeakBeginTime:[
    { required: true, message: "早高峰开始时段" }
  ],
  morningPeakEndTime:[
    { required: true, message: "早高峰结束时段" }
  ],
  eveningPeakBeginTime:[
    { required: true, message: "晚高峰开始时段" }
  ],
  eveningPeakEndTime:[
    { required: true, message: "晚高峰结束时段" }
  ]
}


export const homeData = {
  tabObj,
  businessTypeList,
  cancelModelData,
  cancelRules,
  deviateModelData,
  deviateRules,
  timeModelData,
  timeRules
}