
const rechargeTypeMap = {
  1: '余额'
}

/* 用户列表 */
export const fields = {
  nickname: {
    title: '乘客昵称',
    key: 'nickname',
    tooltip: true,
    minWidth: 150
  },
  realname: {
    title: '乘客姓名',
    key: 'realname',
    tooltip: true,
    minWidth: 100
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
      return h('span', {
        domProps: {
          textContent: realnameOrNotMap[params.row.realnameOrNot]
        }
      })
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
      return h('span', {
        domProps: {
          textContent: statusMap[params.row.status]
        }
      })
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
export const orderHistory = {
  orderType: {
    title: '订单类型',
    key: 'orderType',
    tooltip: true,
    width: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: orderTypeMap[params.row.orderType]
        }
      })
    }
  }, 
  orderNO: {
    title: '订单编号',
    key: 'routeNo',
    tooltip: true,
    minWidth: 200
  },  
  createTime: {
    title: '出发时间',
    key: 'deparTime',
    // sortable: 'custo
    tooltip: true,
    width: 160
  },
  passengerName: {
    title: '乘车人姓名',
    key: 'passengerName',
    tooltip: true,
    width: 100
  },
  passengerMobile: {
    title: '乘车人电话',
    key: 'passengerMobile',
    tooltip: true,
    width: 120
  },
  licensePlateNumber: {
    title: '车牌',
    key: 'licensePlateNumber',
    tooltip: true,
    width: 100
  },
  // vehicleType: {
  //   title: '车型',
  //   key: 'vehicleType',
  //   tooltip: true,
  //   width: 120
  // },
  driverName: {
    title: '司机',
    key: 'driverName',
    tooltip: true,
    width: 80
  },
  driverMobile: {
    title: '司机电话',
    key: 'driverMobile',
    tooltip: true,
    width: 120
  },
  orderFare: {
    title: '订单金额',
    key: 'orderFare',
    // sortable: 'custom',
    tooltip: true,
    width: 110
  },
  orderStatus: {
    title: '订单状态',
    key: 'orderStatus',
    tooltip: true,
    width: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: orderStatusMap[params.row.orderStatus]
        }
      })
    }
  }
}

/* 充值记录 */
export const rechargeHistory = {
  passengerName: {
    tooltip: true,
    minWidth: 100,
    title: '姓名',
    key: 'passengerName'
  },  
  rechargeType: {
    title: '充值类型',
    key: 'rechargeType',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: rechargeTypeMap[params.row.rechargeType]
        }
      })
    }
  },
  payPattern: {
    title: '支付方式',
    key: 'payPattern',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: payPatternMap[params.row.payPattern]
        }
      })
    }
  },
  rechargeAmount: {
    title: '充值金额',
    key: 'rechargeAmount',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: params.row.rechargeAmount ? params.row.rechargeAmount + '元' : ''
        }
      })
    }
  },
  rechargeTime: {
    title: '充值时间',
    key: 'rechargeTime',
    tooltip: true,
    minWidth: 100,
    // sortable: 'custom'
  }
}

/* 消费记录 */
export const expenseHistory = {
  consumeType: {
    title: '消费类型',
    key: 'consumeType',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: consumeTypeMap[params.row.consumeType]
        }
      })
    }
  },  
  payPattern: {
    title: '支付方式',
    key: 'payPattern',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: payPatternMap[params.row.payPattern]
        }
      })
    }
  },
  consumeAmount: {
    title: '消费金额',
    key: 'consumeAmount',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: params.row.consumeAmount + '元'
        }
      })
    }
  },
  consumeTime: {
    title: '消费时间',
    key: 'consumeTime',
    tooltip: true,
    minWidth: 100,
    // sortable: 'custom'
  }
}

/* 退款记录 */
export const refundHistory = {
  refundAmount: {
    title: '退款金额',
    key: 'refundAmount',
    tooltip: true,
    minWidth: 100
  },  
  refundPattern: {
    title: '退款方式',
    key: 'refundPattern',
    tooltip: true,
    minWidth: 100
  },
  crediCardNum: {
    title: '银行卡号/支付宝账户',
    key: 'crediCardNum',
    tooltip: true,
    width: 170
  },
  AlipayNum: {
    title: '支付宝账户',
    key: 'AlipayNum',
    tooltip: true,
    minWidth: 100
  },
  applyTime: {
    title: '申请时间',
    key: 'applyTime',
    tooltip: true,
    width: 180
  },
  refundStatus: {
    title: '状态',
    key: 'refundStatus',
    tooltip: true,
    minWidth: 100
  }
}

/* 优惠券 */
export const coupons = {
  couponName: {
    title: '优惠券名称',
    key: 'couponName',
    width: 150,
    tooltip: true
  },  
  couponType: {
    title: '类型',
    key: 'couponType',
    tooltip: true,
    width: 80,
    render: (h, params) => {
      return h('span', {
        domProps:{
          textContent: couponTypeMap[params.row.couponType]
        }
      })
    }
  },
  couponNum: {
    title: '券码',
    key: 'couponNum',
    tooltip: true,
    width: 80
  },
  couponAmount: {
    title: '面额',
    key: 'couponInfo',
    tooltip: true,
    width: 100,
    align: 'center',
    render: (h,params) => {
      let text = params.row.couponInfo ? params.row.couponInfo : ''
      let span = '<div><p>'+ text +'</p></div>'
      return h('span', {
        domProps: {
          innerHTML: span
        }
      })
    }
  },
  expiryDate: {
    title: '有效期',
    key: 'expiryDate',
    tooltip: true,
    width: 200
  },
  couponSource: {
    title: '优惠券来源',
    key: 'couponSource',
    tooltip: true,
    minWidth: 100
  },
  grantState: {
    title: '优惠券状态',
    key: 'grantState',
    tooltip: true,
    width: 100,
    render: (h, params) => {
      return h('span', {
        style:{
          cursor: 'pointer'
        },
        domProps:{
          textContent: couponStatusMap[params.row.grantState]
        }
      })
    }
  },
  relatedOrder: {
    title: '关联订单',
    key: 'orderUuid',
    tooltip: true,
    width: 180,
    align: 'center',
    render: (h, params) => {
      let text = params.row.orderNo ? params.row.orderNo : '/'
      return h('div', [            
        h('p', {
          on: {
            click: () => {
              // this.detailsRequest(params.row.csmId);
            }
          }
        }, text)
      ])
    }
  }
}

/* 封号记录 */
export const banHistory = {
  disableTime: {
    title: '封号时间',
    key: 'disableTime',
    tooltip: true,
    minWidth: 100,
    // sortable: 'custom'
  },  
  disableCause: {
    tooltip: true,
    minWidth: 100,
    title: '封号原因',
    key: 'disableCause'
  },
  disableDuration: {
    tooltip: true,
    minWidth: 100,
    title: '封号期限',
    key: 'disableDuration',
    // sortable: 'custom'
  },
  operator: {
    tooltip: true,
    minWidth: 100,
    title: '操作人',
    key: 'operator'
  },
  comment: {
    tooltip: true,
    minWidth: 100,
    title: '备注',
    key: 'comment'
  }
}

/* 紧急联系人 */
export const emergencyContact = {
  name: {
    tooltip: true,
    minWidth: 150,
    title: '紧急联系人姓名',
    key: 'name'
  },  
  mobile: {
    tooltip: true,
    minWidth: 100,
    title: '手机号',
    key: 'mobile'
  },
  autoShareOrNot: {
    tooltip: true,
    minWidth: 150,
    title: '是否自动分享',
    key: 'autoShareOrNot',
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: autoShareOrNotMap[params.row.autoShareOrNot]
        }
      })
    }
  },
  addTime: {
    tooltip: true,
    minWidth: 100,
    title: '添加时间',
    key: 'addTime',
    // sortable: 'custom'
  },
  comment: {
    tooltip: true,
    minWidth: 100,
    title: '备注',
    key: 'comment'
  }
}
/* 行程分享记录 */
export const tripSharing = {
  shareTime: {
    tooltip: true,
    minWidth: 100,
    title: '分享时间',
    key: 'shareTime',
    // sortable: 'custom'
  },  
  shareType: {
    tooltip: true,
    minWidth: 100,
    title: '分享类型',
    key: 'shareType',
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: shareTypeMap[params.row.shareType]
        }
      })
    }
  },
  emergencyContactPerson: {
    tooltip: true,
    minWidth: 100,
    title: '紧急联系人',
    key: 'emergencyContactPerson'
  },
  content: {
    tooltip: true,
    minWidth: 100,
    title: '内容',
    key: 'content'
  }
}

export const pageData = {
  isShowAudit: false,
  total: 0,
  current: 1,
  pageSize: 10,
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