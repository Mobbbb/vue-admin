import { 
  sexMap,
  typeTimeMap, 
  orderMainStatusMap, 
  payTypeMap,
  consumeTypeMap,
  shareTypeMap,
  couponTypeMap,
  couponStatusMap,
  rechargeTypeMap,
  freezeTypeMap,
  typeModuleMap
} from '@/libs/status-map'
import router from '@/router'

export const accountStatusMap = {
  0: '正常',
  1: '长期封号',
  2: '短期封号'
}

/* 用户列表 */
export const fields = {
  nickname: {
    title: '乘客昵称',
    key: 'nickname',
    tooltip: true,
    minWidth: 150,
  },
  realname: {
    title: '乘客姓名',
    key: 'realname',
    tooltip: true,
    minWidth: 100,
    fixed: 'left'
  },
  mobile: {
    title: '乘客手机号',
    key: 'mobile',
    tooltip: true,
    minWidth: 150
  },
  sex: {
    title: '性别',
    key: 'sex',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: sexMap[params.row.sex]
        }
      })
    }
  },
  age: {
    title: '年龄',
    key: 'age',
    tooltip: true,
    minWidth: 80
  },
  grealnameOrNot: {
    title: '是否实名',
    key: 'realnameOrNot',
    tooltip: true,
    minWidth: 150,
    render: (h, params) =>{
      let text = '未实名'
      if(params.row.realnameOrNot) text = '已实名'
      return h('span', text)
    }
  },
  cash: {
    title: '现金',
    key: 'cash',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: params.row.cash + '元'
        }
      })
    }
  },
  status: {
    title: '账号状态',
    key: 'status',
    tooltip: true,
    minWidth: 150,
    render: (h, params) =>{
      return h('span', accountStatusMap[params.row.status])
    }
  },
  registerTime: {
    title: '注册时间',
    key: 'registerTime',
    tooltip: true,
    width: 180
  }
};

/* 订单记录 */
export const orderHistory = [
  {
    title: '订单编号',
    key: 'routeNo',
    tooltip: true,
    minWidth: 200,
    fixed: 'left',
    render: (h, params) => {
      return h('a', {
        on: {
          click: () => {
            router.push({
              name: 'order-detail',
              params: {
                id: params.row.orderUuid
              }
            })
          }
        }
      }, params.row.routeNo)
    }
  },
  {
    title: '业务类型',
    key: 'typeModule',
    tooltip: true,
    minWidth: 200,
    render: (h, params) => {
      return h('span', typeModuleMap[params.row.typeModule])
    }
  },
  {
    title: '订单类型',
    key: 'orderType',
    tooltip: true,
    width: 100,
    render: (h, params) => {
      return h('span', typeTimeMap[params.row.orderType])
    }
  },
  {
    title: '下单时间',
    key: 'createTime',
    tooltip: true,
    width: 160
  },
  {
    title: '订单金额（元）',
    key: 'orderFare',
    tooltip: true,
    width: 160
  },
  {
    title: '乘车人姓名',
    key: 'passengerName',
    tooltip: true,
    width: 100
  },
  {
    title: '乘车人电话',
    key: 'passengerMobile',
    tooltip: true,
    width: 120
  },
  {
    title: '车牌',
    key: 'licensePlateNumber',
    tooltip: true,
    width: 100
  },
  {
    title: '司机',
    key: 'driverName',
    tooltip: true,
    width: 80
  },
  {
    title: '司机电话',
    key: 'driverMobile',
    tooltip: true,
    width: 120
  },
  {
    title: '订单状态',
    key: 'orderStatus',
    tooltip: true,
    width: 100,
    render: (h, params) =>{
      return h('span', orderMainStatusMap[params.row.orderStatus])
    }
  }
]

/* 充值记录 */
export const rechargeHistory = [
  {
    title: '充值流水号',
    tooltip: true,
    minWidth: 100,
    key: 'tradeId'
  },
  {
    title: '充值时间',
    key: 'rechargeTime',
    tooltip: true,
    minWidth: 100,
  },
  {
    title: '充值类型',
    key: 'rechargeType',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', rechargeTypeMap[params.row.rechargeType])
    }
  },
  {
    title: '活动名称',
    tooltip: true,
    minWidth: 110,
    key: 'activityName',
    render: (h, params) =>{
      return h('a', {
        on: {
          click: () => {
            router.push({
              name: 'activity-detail',
              params: {
                id: params.row.activityId
              }
            })
          }
        }
      }, params.row.activityName)
    }
  },
  {
    title: '现金（元）',
    tooltip: true,
    minWidth: 100,
    key: 'accountCashStr'
  },
  {
    title: '赠送币（元）',
    tooltip: true,
    minWidth: 100,
    key: 'accountGiftStr'
  },
  {
    title: '支付方式',
    key: 'payPattern',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', payTypeMap[params.row.payPattern])
    }
  }
]

/* 消费记录 */
export const expenseHistory = [
  {
    title: '订单编号',
    key: 'relatedOrder',
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h('a', {
        on: {
          click: () => {
            router.push({
              name: 'order-detail',
              params: {
                id: params.row.orderUuid
              }
            })
          }
        }
      }, params.row.relatedOrder)
    }
  }, 
  {
    title: '支付时间',
    key: 'consumeTime',
    tooltip: true,
    minWidth: 100,
  },
  {
    title: '消费类型',
    key: 'consumeType',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', consumeTypeMap[params.row.consumeType])
    }
  },
  {
    title: '现金（元）',
    tooltip: true,
    minWidth: 100,
    key: 'accountCashStr'
  },
  {
    title: '赠送币（元）',
    tooltip: true,
    minWidth: 100,
    key: 'accountGiftStr'
  },
  {
    title: '支付方式',
    key: 'payPattern',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', payTypeMap[params.row.payPattern])
    }
  }
]

/* 退款记录 */
export const refundHistory = [
  {
    title: '退款单编号',
    key: 'xxxxx',
    tooltip: true,
    minWidth: 100
  },
  {
    title: '退款类型',
    key: 'xxxxx',
    tooltip: true,
    minWidth: 100
  }, 
  {
    title: '现金退款金额（元）',
    key: 'refundAmount',
    tooltip: true,
    minWidth: 150
  },
  {
    title: '赠送币退款金额（元）',
    key: 'refundAmount',
    tooltip: true,
    minWidth: 160
  }, 
  {
    title: '退款渠道',
    key: 'refundPattern',
    tooltip: true,
    minWidth: 100
  },
  {
    title: '退款账号',
    key: 'xxxxx',
    tooltip: true,
    width: 170
  },
  {
    title: '申请时间',
    key: 'applyTime',
    tooltip: true,
    width: 180
  },
  {
    title: '到账时间',
    key: 'xxxxx',
    tooltip: true,
    width: 180
  },
  {
    title: '退款原因',
    key: 'xxxxx',
    tooltip: true,
    width: 180
  },
  {
    title: '退款状态',
    key: 'refundStatus',
    tooltip: true,
    minWidth: 100
  }
]

/* 优惠券 */
export const coupons = [
  {
    title: '优惠券名称',
    key: 'couponName',
    width: 150,
    tooltip: true,
    fixed: 'left'
  },
  {
    title: '活动名称',
    key: 'xxxx',
    width: 150,
    tooltip: true,
    render: (h, params) =>{
      return h('a', {
        on: {
          click: () => {
            router.push({
              name: 'activity-detail',
              params: {
                id: params.row.activityId
              }
            })
          }
        }
      }, params.row.activityName)
    }
  },
  {
    title: '优惠券类型',
    key: 'couponType',
    tooltip: true,
    width: 100,
    render: (h, params) => {
      return h('span', couponTypeMap[params.row.couponType])
    }
  },
  {
    title: '面额（元）',
    key: 'couponMoney',
    tooltip: true,
    width: 100
  },
  {
    title: '发放时间',
    key: 'createdOn',
    tooltip: true,
    width: 120
  },
  {
    title: '有效期',
    key: 'expiryDate',
    tooltip: true,
    width: 190,
    render: (h, params) => {
      return h('span', params.row.expiryDateBegin + ' ~ ' + params.row.expiryDateEnd)
    }
  },
  {
    title: '券状态',
    key: 'grantState',
    tooltip: true,
    width: 100,
    fixed: 'right',
    render: (h, params) => {
      return h('span', couponStatusMap[params.row.grantState])
    }
  }
]

/* 账号管控记录 */
export const banHistory = [
  {
    title: '封号时间',
    key: 'disableTime',
    tooltip: true,
    minWidth: 100,
  },  
  {
    title: '封号类型',
    tooltip: true,
    minWidth: 100,
    key: 'action',
    render: (h, params) => {
      return h('span', freezeTypeMap[params.row.action])
    }
  },
  {
    title: '封号期限',
    tooltip: true,
    minWidth: 250,
    key: 'xxxx',
    render: (h, params) => {
      return h('span', params.row.disableTime + ' ~ ' + params.row.blockEnd)
    }
  },
  {
    title: '操作人',
    key: 'operator',
    tooltip: true,
    minWidth: 100,
  },
  {
    title: '备注',
    tooltip: true,
    minWidth: 100,
    key: 'comment'
  }
]

/* 紧急联系人 */
export const emergencyContact = [
  {
    tooltip: true,
    minWidth: 150,
    title: '紧急联系人姓名',
    key: 'name'
  },  
  {
    tooltip: true,
    minWidth: 100,
    title: '手机号',
    key: 'mobile'
  },
  {
    tooltip: true,
    minWidth: 150,
    title: '是否自动分享',
    key: 'autoShareOrNot',
    render: (h, params) =>{
      let text = '否'
      if(params.row.autoShareOrNot) text = '是'
      return h('span', text)
    }
  },
  {
    tooltip: true,
    minWidth: 100,
    title: '添加时间',
    key: 'addTime',
  },
  {
    tooltip: true,
    minWidth: 100,
    title: '备注',
    key: 'comment'
  }
]

/* 行程分享记录 */
export const tripSharing = [
  {
    tooltip: true,
    minWidth: 100,
    title: '分享时间',
    key: 'shareTime'
  },  
  {
    tooltip: true,
    minWidth: 100,
    title: '分享类型',
    key: 'shareType',
    render: (h, params) =>{
      return h('span', shareTypeMap[params.row.shareType])
    }
  },
  {
    tooltip: true,
    minWidth: 100,
    title: '紧急联系人',
    key: 'emergencyContactPerson'
  },
  {
    tooltip: true,
    minWidth: 100,
    title: '分享内容',
    key: 'content'
  }
]

export const pageData = {
  isShowAudit: false,
  pageData:{
    total: 0,
    current: 1,
    pageSize: 10
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  sidx: 'csmId',
  sord: 'desc',
  tableData: [],
  passengerUuid: '',
  isShow: false,
  isShowTime: false, // 封号->是否显示具体时间
  queryForm: {},
  searchData: {},
  orderTips: {}, // 订单记录
  rechargeTips: {}, // 充值记录
  consumptionTips: {} ,// 消费记录
  disableAccountTips: {}, // 封号记录
  emergencyContactTips: {}, // 紧急联系人
  tripShareTips: {}, // 行程分享记录
  formRule: {
    blockType: [
      {required: true, message: '必填', trigger: 'blur'}
    ],
    date: [
      {required: true, type: 'date', message: '必填', trigger: 'change'}
    ],
    comment: [
      {required: true, message: '必填', trigger: 'blur'}
    ]
  }
};

export const inputList = [
  {
    name: 'text-input',
    bind_key: 'realName',
    placeholder: '请填写乘客姓名',
    value: '',
    titleWidth: 80,
    title: '乘客姓名：',
    inputWidth: 200,
    unicode: '2',
    isHide: false
  },
  {
    name: 'text-input',
    bind_key: 'mobile',
    placeholder: '请填写乘客手机号',
    value: '',
    titleWidth: 80,
    title: '乘客手机号：',
    inputWidth: 200,
    unicode: '2',
    isHide: false
  },
  {
    name: 'date-time-input',
    bind_key: ['startTime', 'endTime'],
    placeholder: '请选择注册时间',
    value: '',
    titleWidth: 80,
    title: '注册时间：',
    inputWidth: 300,
    unicode: '2',
    isHide: false
  },
]

export const customerData = [
  {
    key: 'basicInfo',
    title: '基本信息',
    value: [
      { name: "乘客手机号", key: "mobile", span: '12', value: ''},
      { name: "账号状态", key: "status", span: '12', value: ''},
      { name: "乘客姓名", key: "name", span: '12', value: ''},
      { name: "实名制状态", key: "dautoynmStatus", span: '12', value: ''},
      { name: "乘客昵称", key: "nickName", span: '12', value: ''},
      { name: "证件类型", key: "IDCardType", span: '12', value: '身份证'},
      { name: "年龄", key: "age", span: '12', value: ''},
      { name: "证件号", key: "iDNO", span: '12', value: ''},
      { name: "籍贯", key: "nativePalce", span: '12', value: ''},
      { name: "头像", key: "face", span: '12', value: ''},
      { name: "性别", key: "sex", span: '24', value: ''},
    ]
  },
  {
    key: 'registerInfo',
    title: '注册信息',
    value: [
      { name: "注册时间", key: "registerTime", span: '12', value: ''},
      { name: "注册城市", key: "registerArea", span: '12', value: ''},
      { name: "注册渠道", key: "registerChannel", span: '12', value: ''},
      { name: "注册来源", key: "registerSource", span: '12', value: ''}
    ]
  },
  {
    key: 'occupationInfo',
    title: '职业信息',
    value: [
      { name: "邮箱", key: "email", span: '12', value: ''},
      { name: "行业", key: "industry", span: '12', value: ''},
      { name: "公司", key: "company", span: '12', value: ''},
      { name: "职业", key: "profession", span: '12', value: ''},
      { name: "个性签名", key: "characterSignature", span: '24', value: ''}
    ]
  },
  {
    key: 'walletInfo',
    title: '钱包信息',
    value: [
      { name: "余额", key: "passengerAccountBalance", span: '24', value: '', unit: '元'},
      { name: "现金", key: "cash", span: '24', value: '', unit: '元'},
      { name: "赠送币", key: "accountGiftMoney", span: '24', value: '', unit: '元'}
    ]
  },
  {
    key: 'otherInfo',
    title: '其他信息',
    value: [
      { name: "客户端APP版本", key: "appVersion", span: '12', value: ''},
      { name: "设备型号", key: "deviceTypeAndToken", span: '12', value: []},
      { name: "最近一次冒泡城市", key: "lastStayCity", span: '24', value: ''},
      { name: "最近一次下单城市", key: "lastOrderCity", span: '24', value: ''}
    ]
  }
]