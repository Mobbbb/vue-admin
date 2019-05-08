/* 司机管理->人员管理 */
import router from '@/router';

/** 司机状态映射表 */
 const driverStatusMap = {
  1: '正常',
  2: '短期封号',
  3: '长期封号',
  4: '未审核',
  5: '删除',
  6: '离职',
  7: '黑名单',
  8: '强制下线'
}
/** 司机管理黑名单状态 */
 const blackStatusMap = {
  1: '封号',
  2: '解封',
  3: '拉黑',
  4: '移除黑名单'
}
/** 订单类型 */
 const orderTypeStatusMap = {
  1: '实时',
  2: '预约'
}
/** 订单状态 */
const orderMainStatusMap = {
  0: "约车中",
  1: "预约中",
  2: "接乘中",
  3: "已抵达接乘地",
  4: "载乘中",
  5: "已抵达目的地",
  6: "待支付",
  7: "待评价",
  8: "行程结束",
  9: "行程取消"
}
/**请假类型 */
let leaveTypeMap = {
  1: "事假",
  2: "病假",
  3: "正常休息"
}
/**请假类型 */
let leaveStatusMap = {
  1: "待审批",
  2: "审批通过",
  3: "审批不通过"
}

export const driverList = {
  name: {
    title: '姓名',
    key: 'name',
    tooltip: true,
    fixed: 'left',
    width: 100
  },
  mobile: {
    title: '手机号',
    key: 'mobile',
    // sortable: 'custom',
    tooltip: true,
    width: 160
  },
  driverNo: {
    title: '司机ID',
    key: 'driverNo',
    tooltip: true,
    width: 160
  },
  agentName: {
    title: '运营商',
    key: 'agentName',
      // sortable: 'custom',
    tooltip: true,
    width: 200,
  },
  plateNum: {
      title: '车牌号',
      key: 'plateNum',
      // sortable: 'custom',
      tooltip: true,
      width: 100
  },
  modelName: {
      title: '车型',
      key: 'modelName',
       // sortable: 'custom',
      tooltip: true,
      width: 100
  },
  city: {
      title: '所属城市',
      key: 'city',
      // sortable: 'custom',
      tooltip: true,
      width: 100
  },
  createdOn: {
      title: '添加时间',
      key: 'createdOn',
      // sortable: 'custom',
      tooltip: true,
      width: 180
  },
  entryTime: {
      title: '入职时间',
      key: 'entryTime',
      // sortable: 'custom',
      tooltip: true,
      width: 180
  },
  status: {
      title: '状态',
      key: 'status',
      // sortable: 'custom',
      tooltip: true,
      width: 100,
      render:(h, params) => {
        return h('span', {
          domProps: {
            textContent: driverStatusMap[params.row.status]
          }
        })
      }
  },
  operationRemark: {
      title: '备注',
      key: 'operationRemark',
      // sortable: 'custom',
      tooltip: true,
      width: 200
  }
};
export const pageData = {
  isLoading: false,
  isUpImg: false,
  isShowUnblockTime: false,
  queryAjaxPramas: {},
  isShowMore: false,
  isShowBlockade: false,
  searchData: { },
  blockadeTitle: '封号',
  joinTime: '',
  isShowAlert: false,
  isAudit: false,
  otherOperateModalTitle: '加入黑名单',
  auditId: 0,
  isShowOtherModal: false,
  commonFormData: {},
  blockadeFormData: {},
  blockadeRule: {
    blockEnd: [
      { required: true, message: '必填' }
    ],
    type: [{required: true,message: '必填'}],
    operateRemark: [
      { required: true, message: '必填'},
    ]
  },
  blacklistFormData: {},
  otherOperateRule: {
    operateRemark: [
      { required: true, message: '必填'}
    ]
  },
  isShowAudit: false,
  total: 0,
  current: 1,
  pageSize: 10,
  customList: {...driverList},
  pageSizeOpts: [15, 30, 50, 100],
  tableColumns: [],
  tableColumnsChecked: ['name', 'mobile', 'plateNum', 'modelName', 'city', 'createdOn', 'entryTime', 'operationRemark', 'status', 'agentName'],
  // sidx: 'csmId',
  // sord: 'desc',
  tableData: []
}

/** 档案详情 */
export const recordData = {
  activeIndex: '1',
  driverLicenseOn: '',
  entryTime: '',
  isShowMap: false,
  homeAddress: '',
  driverBaseInfo: {
  },
  baseDetail:{},
  driveLicenceDetail: {},
  educationalRecord: [
    {
      text: '研究生',
      value: '19'
    },
    {
      text: '大学本科',
      value: '21'
    },
    {
      text: '大学专科',
      value: '31'
    },
    {
      text: '中等专科',
      value: '41'
    },
    {
      text: '普通高中',
      value: '61'
    },
    {
      text: '初中',
      value: '71'
    },
    {
      text: '小学',
      value: '81'
    }
  ],
  baseDetailRule: {
    name: [
      { required: true, message: '必填'}
    ],
    age: [
      {type:'number',message: '必须填写18-65之间的数字', min: 18, max: 65}
    ],
    idCard: [
      { required: true, message: '必填'}
    ],
    mobile: [
      { required: true, message: '必填' }
    ],
    entryTime: [
      { required: true, message: '必填'}
    ]
  },
  driveLicenceDetailRule: {
    licenseId: [
      { required: true, message: '必填'}
    ],
    driverType: [
      { required: true, message: '必填'}
    ]
  },
  qualificationDetail: {},
  qualificationDetailRule: {},
  carDetail: {},
  driverLeaderDetail: {},
  maxUpLoadCount: 3,
  drivingLicenceHomeImg: [],
  drivingLicenceSubImg: [],
  faceImg: [],
  idCardFaceImg: [],
  idCardBackImg: [],
  driverIdCardImg: [],
  facePhotoList: []
}

/**订单记录 */
export const orderList = [
  {
    title: '订单号',
    key: 'orderNo',
    ellipsis: true,
    tooltip: true,
    width: 180,
    render: (h, params) => {
      return h('a', {
        on: {
          click: () => {
            router.push({
              path: '/order/order-detail/' + params.row.uuid
            })
          }
        }
      }, params.row.orderNo)
    }
  },
   {
    title: '下单时间',
    key: 'createTime',
    ellipsis: true,
    tooltip: true,
    width: 160
  },
 {
    title: '完成时间',
    key: 'arriveTime',
    ellipsis: true,
    tooltip: true,
    width: 160
  },
  {
    title: '订单类型',
    key: 'typeTime',
    ellipsis: true,
    tooltip: true,
    width: 160,
    render: (h, params) => {
      return h('span', {
      }, orderTypeStatusMap[params.row.typeTime])
    }
  },
   {
    title: '起点',
    key: 'originAddress',
    ellipsis: true,
    tooltip: true,
    width: 160
  },
 {
    title: '终点',
    key: 'destAddress',
    ellipsis: true,
    tooltip: true,
    width: 160
  },
  {
    title: '途径点',
    key: 'passingAddresses',
    width: 160,
    tooltip: true,
    /*render:(h,params)=>{
      let text = params.row.passingAddresses
      // if (Array.isArray(params.row.passingAddresses)) {
      //   text = params.row.passingAddresses.join(',');
      // }
      return h('Tooltip', {
        props: {
            content: text,
            placement: 'bottom-start'
        },
        style: {
          width: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
      }
      }, text)
    }*/
  },
 {
    title: '状态',
    key: 'status',
    ellipsis: true,
    tooltip: true,
    width: 160,
    render: (h, params)=> {
     return h('span', {
      }, orderMainStatusMap[params.row.status])
    }
  },
 {
    title: '金额',
    key: 'confirmOrderFare',
    ellipsis: true,
    tooltip: true,
    width: 160
  },
]

/** 封号记录 */
export const blockList = [
 {
    title: '类型',
    key: 'action',
    ellipsis: true,
    render:(h, params) => {
      return h('span', {
        domProps: {
          textContent: blackStatusMap[params.row.action]
        }
      })
    }
  },
 {
    title: '备注',
    key: 'operateRemark',
    ellipsis: true
  },
 {
    title: '操作人',
    key: 'operateUser',
    ellipsis: true
  },
 {
    title: '添加时间',
    key: 'createTime',
    ellipsis: true
  },
]

/** 上下线记录 */
export const signLogList = [
  {
    title: '上线时间',
    key: 'onWorkTime',
    ellipsis: true
  },
  {
    title: '下线时间',
    key: 'offWorkTime',
    ellipsis: true
  },
  {
    title: '操作人',
    key: 'operateUser',
    ellipsis: true
  },
 {
    title: '备注',
    key: 'operateRemark',
    ellipsis: true
  }
]
/** 违章记录 */
export const violationRecordList = [
 {
    title: '车型',
    key: 'modelName',
    ellipsis: true,
    width: 160
  },
  {
    title: '车牌号',
    key: 'plateNum',
    ellipsis: true,
    width: 160
  },
 {
    title: '违章时间',
    key: 'changeTime',
    ellipsis: true,
    width: 160
  },
 {
    title: '扣分',
    key: 'penaltyPoint',
    ellipsis: true,
    width: 160
  },
  {
    title: '罚款',
    key: 'fines',
    ellipsis: true,
    width: 160
  },
  {
    title: '违章描述',
    key: 'reason',
    ellipsis: true,
    width: 160
  },
 {
    title: '违章描述',
    key: 'status',
    ellipsis: true,
    width: 160
  },
 {
    title: '备注',
    key: 'remark',
    ellipsis: true,
    width: 160
  },
]
/** 请假记录 */
export const leaveRecordList = [
  {
    title: '请假类型',
    key: 'type',
    ellipsis: true,
    width: 160,
    render: (h, params)=>{
      return h('span',{},
      leaveTypeMap[params.row.type]
      )
    }
  },
  {
    title: '开始时间',
    key: 'startTime',
    ellipsis: true,
    width: 160
  },
  {
    title: '结束时间',
    key: 'endTime',
    ellipsis: true,
    width: 160
  },
  {
    title: '请假天数',
    key: 'days',
    ellipsis: true,
    width: 160
  },
 {
    title: '请假事由',
    key: 'reason',
    ellipsis: true,
    width: 160
  },
  {
    title: '添加时间',
    key: 'createTime',
    ellipsis: true,
    width: 160
  },
  {
    title: '审批人',
    key: 'approver',
    ellipsis: true,
    width: 160
  },
  {
    title: '审批时间',
    key: 'approvalTime',
    ellipsis: true,
    width: 160
  },
  {
    title: '审批状态',
    key: 'status',
    ellipsis: true,
    width: 160,
    render: (h, params)=>{
      let text = leaveStatusMap[params.row.status]
      return h('span', {
      },text)
    }
  },
 {
    title: '备注',
    key: 'failReason',
    ellipsis: true,
    width: 160
  }
]
/** 通话记录 */
export const callTableList = [
  {
    title: '关联订单',
    key: 'orderNo',
    ellipsis: true,
    minthWidth: 160,
    render: (h, params)=>{
      return h('a', {
        domProps:{
          textContent: params.row.orderNo
        },
        on:{
          click(){
            let orderId = params.row.orderUuid
            router.push({
              path: '/order/order-detail/' + orderId
            })
          }
        }
      })
    }
  },
  {
    title: '主叫号码',
    key: 'dialerMobile',
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: '被叫号码',
    key: 'answerMobile',
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: '开始时间',
    key: 'startTime',
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: '结束时间',
    key: 'endTime',
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: '通话时长',
    key: 'callDuration',
    ellipsis: true,
    minthWidth: 160
  }
]
/** 修改/详情数据 */
export const detailData = {
  isShowRecord: true,
  isHideAppraiseRecord: false,
  isShowTopMenu: true,
  name: '无名',
  starCount: 0,
  face: '',
  activeIndex: 0,
  isLoading: false,
  total: 0,
  photoTotal: 0,
  current: 1,
  photoCurrentPage:1,
  pageSize: 10,
  photoPageSize: 12,
  evaluateTotal:0,
  evaluateCurrentPage: 1,
  evaluatePageSize: 15,
  pageSizeOpts: [15, 30, 50, 100],
  tableColumns: [],
  evaluateColumns: [],
  evaluateData: [],
  allTagData:[],
  tableData: [],
  searchDate: null,
  carUuid: null,
  startTime: null,
  endTime: null,
  carNoList: [],
  singleDriverDetail: [
    {
      title: '里程',
      key: 'serviceMileage',
      value: '暂无数据'
    },
    {
      title: '订单量',
      key: 'orderCount',
      value: '暂无数据'
    },
    {
      title: '营业总额',
      key: 'totalIncome',
      value: '暂无数据'
    },
    {
      title: '司机电话',
      key: 'mobile',
      value: '暂无数据'
    },
    {
      title: '身份证号码',
      key: 'idCard',
      value: '暂无数据'
    },
    {
      title: '城市',
      key: 'city',
      value: '杭州'
    },
    {
      title: '运营商',
      key: 'agentName',
      value: '重庆车联科技'
    },
    {
      title: '司机ID',
      key: 'driverNo',
      value: '暂无数据'
    }
  ],
  pickureList: [],
  tagSearchValue: {},
  tagColumns: [
    {
      title:'标签',
      key: 'tag'
    },
    {
      title:'次数',
      key: 'count'
    }
  ],
  tagDatas: []
}
/**被评价记录 */
export const evaluateColumns = [
  {
    title:'评价标签',
    key: 'evaluateTag',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title:'评价内容',
    key: 'content',
    ellipsis: true,
    tooltip: true,
  },
  {
    title:'星级',
    key: 'score',
    width: 100
  },
  {
    title:'订单编号',
    key: 'orderNo',
    ellipsis: true,
    tooltip: true,
    render: (h, params)=>{
      return h('a', {
        domProps:{
          textContent: params.row.orderNo
        },
        on: {
          click(){
            let orderId = params.row.orderUuid
            router.push({
              path: '/order/order-detail/' + orderId
            })
          }
        }
      })
    }
  }
]

/** 被投诉记录 */
export const complainedList = [
  {
    title: '关联订单号',
    key: 'complainNo',
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: '投诉原因',
    key: 'contents',
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: '投诉类型',
    key: 'complainType',
    ellipsis: true,
    minthWidth: 160
  },
 {
    title: '投诉结果',
    key: 'visitResult',
    ellipsis: true,
    minthWidth: 160
  },
  {
    title: '投诉时间',
    key: 'visitTime',
    ellipsis: true,
    minthWidth: 160
  }
]