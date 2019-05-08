

//订单主状态 
export const orderMainStatusMap = {
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

export const payTypeMap = {
  1: "支付宝",
  2: "微信",
  3: "一网通",
  4: "余额",
  5: "优惠券",
  6: "线下支付"
}

export const drawBillMap = {
  0: '待开票',
  1: '已开票',
}

export const invoiceTypeMap = {
  1: '电子发票',
  2: '纸质发票'
}

export const cancelTypeMap = {
  0: '乘客无责取消',
  1: '乘客政策免费取消',
  2: '乘客使用免费次数取消',
  3: '乘客付费取消',
  4: '超时自动取消',
}

/* 订单列表 */
export const fields = {
  typeModule: {
    title: '业务类型',
    key: 'typeModule',
    ellipsistypeTime: true,
    width: 100,
    render: (h, params) => {
      return h('span', {
        domProps: {
          textContent: useTypeMap[params.row.typeModule]
        }
      })

    }
  },
  routeNo: {
    title: '订单编号',
    key: 'routeNo',
    tooltip: true,
    minWidth: 200
  },
  typeTime: {
    title: '订单类型',
    key: 'typeTime',
    tooltip: true,
    width: 100,
    render: (h, params) => {
      return h('span', {
        domProps: {
          textContent: orderTypeMap[params.row.typeTime]
        }
      })
    }
  },
  createTime: {
    title: '下单时间',
    key: 'createTime',
    tooltip: true,
    width: 180
  },
  actualPasNam: {
    title: '乘车人姓名',
    key: 'actualPasNam',
    tooltip: true,
    width: 100
  },
  actualPasMob: {
    title: '乘车人电话',
    key: 'actualPasMob',
    tooltip: true,
    width: 130
  },
  nickName: {
    title: '乘客昵称',
    key: 'nickName',
    tooltip: true,
    width: 130
  },
  passengerName: {
    title: '乘客姓名',
    key: 'passengerName',
    tooltip: true,
    width: 130
  },
  passengerMobile: {
    title: '乘客手机号',
    key: 'passengerMobile',
    tooltip: true,
    width: 130
  },
  driverName: {
    title: '司机',
    key: 'driverName',
    tooltip: true,
    width: 100
  },
  driverMobile: {
    title: '司机电话',
    key: 'driverMobile',
    tooltip: true,
    width: 130
  },
  plateNum: {
    title: '车牌',
    key: 'plateNum',
    tooltip: true,
    width: 100
  },
  carLevelName: {
    title: '车型',
    key: 'carLevelName',
    tooltip: true,
    width: 100
  },
  originAddress: {
    title: '出发地',
    key: 'originAddress',
    width: 130,
    tooltip: true
  },
  destAddress: {
    title: '目的地',
    key: 'destAddress',
    tooltip: true,
    width: 130,
    tooltip: true
  },
  totalFare: {
    title: '订单金额',
    key: 'totalFare',
    tooltip: true,
    width: 100
  },
  mainStatus: {
    title: '订单状态',
    key: 'mainStatus',
    tooltip: true,
    width: 100,
    render: (h, params) => {
      return h('span', {
        domProps: {
          textContent: orderMainStatusMap[params.row.mainStatus]
        }
      })
    }
  }
};
/** 途径点修改记录 */
export const wayRecords = [{
    title: '修改次数',
    key: 'index',
    width: 120
  },
  {
    title: '起点',
    key: 'start',
    ellipsis: true,
    width: 120,
    tooltip: true
  },
  {
    title: '途经点1',
    key: 'passing1',
    ellipsis: true,
    align: 'center',
    width: 120,
    render: (h, params) => {
      return h('span', {
        domProps: {
          textContent: params.row.passing1 ? params.row.passing1 : '/'
        }
      })
    }
  },
  {
    title: '途经点2',
    key: 'passing2',
    ellipsis: true,
    align: 'center',
    width: 120,
    render: (h, params) => {
      return h('span', {
        domProps: {
          textContent: params.row.passing2 ? params.row.passing2 : '/'
        }
      })
    }
  },
  {
    title: '途经点3',
    key: 'passing3',
    ellipsis: true,
    align: 'center',
    width: 120,
    render: (h, params) => {
      return h('span', {
        domProps: {
          textContent: params.row.passing3 ? params.row.passing3 : '/'
        }
      })
    }
  },
  {
    title: '终点',
    key: 'end',
    ellipsis: true,
    width: 120,
    tooltip: true
  },
  {
    title: '提交时间',
    key: 'time',
    width: 160,
    ellipsis: true
  }
]
export const pageData = {
  isLoading: false,
  isShowAudit: false,
  total: 0,
  current: 1,
  pageSize: 10,
  // customList: {
  //   ...fields
  // },
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableColumnsChecked: Object.keys(fields),   //['typeModule', 'routeNo', 'typeTime', 'createTime', 'actualPasNam', 'actualPasMob', 'driverName', 'driverMobile', 'plateNum', 'originAddress', 'destAddress', 'totalFare', 'mainStatus'],
  tableData: [],
  searchData: {},
}


/** 订单详情 */
export const orderData = {
  orderInfo: [{
      name: "订单状态",
      key: "mainStatus",
      span: '12',
      value: ''
    },
    {
      name: "订单编号",
      key: "routeNo",
      span: '12',
      value: ''
    },
    //{ name: "顺风车类型", key: "xxxxx", span: '8', value: ''},
    {
      name: "业务类型",
      key: "typeModule",
      span: '12',
      value: ''
    },
    {
      name: "订单类型",
      key: "typeTime",
      span: '12',
      value: ''
    },
    {
      name: "起点",
      key: "originDetailAddress",
      span: '12',
      value: ''
    },
    {
      name: "终点",
      key: "destDetailAddress",
      span: '12',
      value: ''
    },
    {
      name: "是否代叫车",
      key: "typeSelf",
      span: '24',
      value: ''
    },
    /*{ name: "下单人姓名", key: "passengerName", span: '6', value: ''},
    { name: "下单人电话", key: "passengerMobile", span: '6', value: ''},
    { name: "乘车人昵称", key: "nickName", span: '6', value: ''},*/
  ],
  timeInfo: [{
      name: "下单时间",
      key: "routePlanCreateTime",
      span: '12',
      value: ''
    },
    {
      name: "接单时间",
      key: "dirverReceiveTime",
      span: '12',
      value: ''
    },
    {
      name: "预计出发时间",
      key: "departTime",
      span: '12',
      value: ''
    },
    {
      name: "司机到达时间",
      key: "driverArriveTime",
      span: '12',
      value: ''
    },
    {
      name: "乘客上车时间",
      key: "passsengerArriveTime",
      span: '12',
      value: ''
    },
    {
      name: "行程结束时间",
      key: "arriveTime",
      span: '12',
      value: ''
    },
    {
      name: "到达途经点1时间",
      key: "arrivePassingPoint1Time",
      span: '12',
      value: ''
    },
    {
      name: "到达途经点2时间",
      key: "arrivePassingPoint2Time",
      span: '12',
      value: ''
    },
    {
      name: "到达途经点3时间",
      key: "arrivePassingPoint3Time",
      span: '12',
      value: ''
    },
  ],
  driverInfo: [{
      name: "乘客姓名",
      key: "passengerName",
      span: '12',
      value: ''
    },
    {
      name: "乘客手机号",
      key: "passengerMobile",
      span: '12',
      value: ''
    },
    {
      name: "乘车人姓名",
      key: "actualPassengerName",
      span: '12',
      value: ''
    },
    {
      name: "乘车人手机号",
      key: "actualPassengerMobile",
      span: '12',
      value: ''
    },
    {
      name: "司机姓名",
      key: "actualDriverName",
      span: '12',
      value: ''
    },
    {
      name: "司机手机号",
      key: "actualDriverMobile",
      span: '12',
      value: ''
    },
    {
      name: "车牌号",
      key: "plateNum",
      span: '12',
      value: ''
    },
    {
      name: "车型",
      key: "carModel",
      span: '12',
      value: ''
    },
  ],
  roadInfo: [{
      name: "行驶里程",
      key: "drivenDistance",
      span: '12',
      value: ''
    },
    {
      name: "行驶时长",
      key: "drivenTime",
      span: '12',
      value: ''
    },
    {
      name: "行程里程",
      key: "tripDistance",
      span: '12',
      value: ''
    },
    {
      name: "行程时长",
      key: "tripDuration",
      span: '12',
      value: ''
    },
    {
      name: "远途里程",
      key: "haulBackTrip",
      span: '12',
      value: ''
    },
    {
      name: "夜间时段里程",
      key: "nightTrip",
      span: '12',
      value: ''
    },
  ],
  chargeInfo: [{
      name: "起步价",
      key: "startFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "超时等待费",
      key: "waitFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "平台取消费用",
      key: "xxxx",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "乘客取消费用",
      key: "cancelFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "里程费",
      key: "overTripFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "时长费",
      key: "overTimeFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "远途里程费",
      key: "haulBackFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "夜间费",
      key: "nightFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "高速费",
      key: "highwayFare",
      span: '8',
      value: '0',
      changeKey: 'adjust',
      unit: '元'
    },
    {
      name: "路桥费",
      key: "roadBridgeFare",
      span: '8',
      value: '0',
      changeKey: 'adjust',
      unit: '元'
    },
    {
      name: "停车费",
      key: "parkingFare",
      span: '8',
      value: '0',
      changeKey: 'adjust',
      unit: '元'
    },
    {
      name: "其他",
      key: "otherFare",
      span: '8',
      value: '0',
      changeKey: 'adjust',
      unit: '元'
    },

    {
      name: "司机减免",
      key: "driverReliefFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "折让费",
      key: "discountFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "订单计费价格",
      key: "orderFare",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "优惠券抵扣金额",
      key: "couponAmount",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "待乘客支付金额",
      key: "waitPassengerPayAmount",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "实付金额",
      key: "payAmount",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "退款金额",
      key: "xxxxx",
      span: '24',
      value: '0',
      unit: '元'
    },
    {
      name: "支付时间",
      key: "payTime",
      span: '8',
      value: '',
      unit: ''
    },
    {
      name: "支付方式",
      key: "payType",
      span: '16',
      value: '',
      unit: ''
    }, // ALIPAY(1,"支付宝"), WEIXIN(2,"微信"), NETCOM(3,"一网通"), BALANCE(4,"余额"), COUPON(5,"优惠券"), OFFLINE(6,"线下支付");
    {
      name: "赠送币",
      key: "balanceGift",
      span: '8',
      value: '0',
      unit: '元'
    },
    {
      name: "现金（余额）",
      key: "balanceCash",
      span: '16',
      value: '0',
      unit: '元'
    },
    {
      name: "第三方支付金额",
      key: "thirdAmount",
      span: '24',
      value: '0',
      unit: '元'
    },
    {
      name: "是否申请发票",
      key: "billedStatus",
      span: '8',
      value: '',
      unit: ''
    }, // 0:待开票，1:已开票
    {
      name: "发票编号",
      key: "invoiceNo",
      span: '16',
      value: '',
      unit: ''
    },
    {
      name: "发票类型",
      key: "invoiceType",
      span: '24',
      value: '',
      unit: ''
    } // (1.电子发票,2.纸质发票)
    //{ name: "迟到费用", key: "xxxx", span: '4', value: '0', unit: '元'},
    //{ name: "取消费用", key: "cancelFare", span: '5', value: '0', unit: '元'},
    //{ name: "感谢费用", key: "xxxx", span: '4', value: '0', unit: '元'},
    //{ name: "应付金额", key: "orderFare", span: '8', value: '0', changeKey: 'adjust', unit: '元'},
  ],
  adjustFare: [{
      name: "高速费",
      key: "adjustHighwayFare",
      span: '4',
      value: ''
    },
    {
      name: "路桥费",
      key: "adjustRoadBridgeFare",
      span: '8',
      value: ''
    },
    {
      name: "停车费",
      key: "adjustParkingFare",
      span: '4',
      value: ''
    },
    {
      name: "其他",
      key: "adjustOtherFare",
      span: '8',
      value: ''
    },
    {
      name: "订单计费价格",
      key: "adjustOrderFare",
      span: '8',
      value: '',
    },
    //{ name: "应付金额", key: "adjustOrderFare", span: '8', value: ''},
  ],
  cancelInfo: [{
      name: "取消时间",
      key: "cancelTime",
      span: '12',
      value: ''
    },
    {
      name: "取消类型",
      key: "cancelType",
      span: '12',
      value: ''
    }, // 0 乘客无责取消 1 乘客政策免费取消 2 乘客使用免费次数取消  3 乘客付费取消 4超时自动取消
    {
      name: "取消原因",
      key: "cancelReason",
      span: '24',
      value: ''
    },
    //{ name: "计费规则", key: "carModelsLevelUuid", span: '8', value: ''},
  ],
  firstComment: [{
      name: "评价时间",
      key: "firstEvaluateTime",
      span: '24',
      value: ''
    },
    {
      name: "司机评星",
      key: "firstEvaluateDriverStars",
      span: '8',
      value: null,
      star: true
    },
    {
      name: "平台评星",
      key: "firstEvaluatePlantformStars",
      span: '8',
      value: null,
      star: true
    },
    {
      name: "车辆评星",
      key: "firstEvaluateCarStars",
      span: '8',
      value: null,
      star: true
    },
    {
      name: "标签",
      key: "firstEvaluateDriverTags",
      span: '8',
      value: ''
    }, //司机
    {
      name: "标签",
      key: "firstEvaluatePlantformTags",
      span: '8',
      value: ''
    }, //平台
    {
      name: "标签",
      key: "firstEvaluateCarTags",
      span: '8',
      value: ''
    }, //车辆
    {
      name: "评价内容",
      key: "firstEvaluateDriverContent",
      span: '8',
      value: '',
      content: true
    }, //司机
    {
      name: "评价内容",
      key: "firstEvaluatePlantformContent",
      span: '8',
      value: '',
      content: true
    }, //平台
    {
      name: "评价内容",
      key: "firstEvaluateCarContent",
      span: '8',
      value: '',
      content: true
    } //车辆
  ],
  updateComment: [{
      name: "评价时间",
      key: "secondEvaluateTime",
      span: '24',
      value: ''
    },
    {
      name: "司机评星",
      key: "secondEvaluateDriverStars",
      span: '8',
      value: null,
      star: true
    },
    {
      name: "平台评星",
      key: "secondEvaluatePlantformStars",
      span: '8',
      value: null,
      star: true
    },
    {
      name: "车辆评星",
      key: "secondEvaluateCarStars",
      span: '8',
      value: null,
      star: true
    },
    {
      name: "标签",
      key: "secondEvaluateDriverTags",
      span: '8',
      value: ''
    }, //司机
    {
      name: "标签",
      key: "secondEvaluatePlantformTags",
      span: '8',
      value: ''
    }, //平台
    {
      name: "标签",
      key: "secondEvaluateCarTags",
      span: '8',
      value: ''
    }, //车辆
    {
      name: "评价内容",
      key: "secondEvaluateDriverContent",
      span: '8',
      value: '',
      content: true
    }, //司机
    {
      name: "评价内容",
      key: "secondEvaluatePlantformContent",
      span: '8',
      value: '',
      content: true
    }, //平台
    {
      name: "评价内容",
      key: "secondEvaluateCarContent",
      span: '8',
      value: '',
      content: true
    } //车辆
  ]
}
