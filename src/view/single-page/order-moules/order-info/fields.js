import { orderMainStatusMap, typeTimeMap, typeModuleMap } from '@/libs/status-map'

/* 订单列表 */
export const fields = {
  typeModule: {
    title: '业务类型',
    key: 'typeModule',
    ellipsistypeTime: true,
    width: 100,
    fixed: 'left',
    render: (h, params) => {
      return h('span', {
        domProps: {
          textContent: typeModuleMap[params.row.typeModule]
        }
      })
    }
  },
  routeNo: {
    title: '订单编号',
    key: 'routeNo',
    tooltip: true,
    minWidth: 200,
    fixed: 'left'
  },
  typeTime: {
    title: '订单类型',
    key: 'typeTime',
    tooltip: true,
    width: 100,
    render: (h, params) => {
      return h('span', {
        domProps: {
          textContent: typeTimeMap[params.row.typeTime]
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
    title: '下单人昵称',
    key: 'nickName',
    tooltip: true,
    width: 130
  },
  passengerName: {
    title: '下单人姓名',
    key: 'passengerName',
    tooltip: true,
    width: 130
  },
  passengerMobile: {
    title: '下单人手机号',
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
}

/** 途径点修改记录 */
export const wayRecords = [
  {
    title: '设置顺序',
    key: 'index',
    width: 120,
    render: (h, pamras) => {
      let text = ''
      if(!pamras.index){
        text = '首次设置'
      } else {
        text = '第' + pamras.index + '次修改'
      }
      return h('span', text)
    }
  },
  {
    title: '途经点1',
    key: 'passing0',
    minWidth: 120,
    tooltip: true
  },
  {
    title: '途经点2',
    key: 'passing1',
    tooltip: true,
    minWidth: 120
  },
  {
    title: '途经点3',
    key: 'passing2',
    tooltip: true,
    minWidth: 120
  },
  {
    title: '目的地',
    key: 'destPoint',
    tooltip: true,
    minWidth: 120
  },
  {
    title: '修改时间',
    key: 'updateTime',
    minWidth: 120,
    tooltip: true
  }
]

export const pageData = {
  isLoading: false,
  isShowAudit: false,
  pageData:{
    total: 0,
    current: 1,
    pageSize: 10
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableColumnsChecked: Object.keys(fields),  
  tableData: [],
  searchData: {},
}

/** 
 * 订单详情-左侧
 * @description 车辆位置和时间的key命名规则: 状态类型_tiem/状态类型_position
 * @description 评价的key也是类似的命名规则
 */
export const orderLeftData = [
  {
    title: '下单',
    key: 'placeOrder',
    value: [
      { name: "冒泡时间", key: "bubbleTime", span: '8', value: ''},
      { name: "冒泡预估金额", key: "bubbleEstimateAmount", span: '8', value: '', unit: '元', type: 'number'},
      { name: "冒泡动态折扣", key: "bubbleDynamicDiscount", span: '8', value: '', acount: true},
      { name: "冒泡预估时长", key: "bubbleEstimateDuration", span: '8', value: ''},
      { name: "冒泡预估里程", key: "bubbleEstimateMileage", span: '16', value: '', unit: '公里', type: 'number'},
      { name: "下单时间", key: "routePlanCreateTime", span: '8', value: ''},
      { name: "车辆位置", key: "order_msg_position", span: '16', value: '', link: 'position'},
      { name: "预估金额", key: "planFare", span: '8', value: '', unit: '元', type: 'number'},
      { name: "动态折扣", key: "rate", span: '8', value: '', acount: true},
      { name: "定价规则版本", key: "xxxx", span: '8', value: '暂无', link: 'rule'},
      { name: "预估里程", key: "planTrip", span: '8', value: '', unit: '公里', type: 'number'},
      { name: "预估时长", key: "planDuration", span: '16', value: ''},
    ]
  },
  {
    title: '派单',
    key: 'distributOrder',
    value: [
      { name: "派单时间", key: "receive_msg_time", span: '8', value: ''},
      { name: "车辆位置", key: "receive_msg_position", span: '16', value: '', link: 'position'},
    ]
  },
  {
    title: '接单',
    key: 'receiveOrder',
    value: [
      { name: "接单时间", key: "reply_msg_time", span: '8', value: ''},
      { name: "车辆位置", key: "reply_msg_position", span: '16', value: '', link: 'position'},
    ]
  },
  {
    title: '开始服务',
    key: 'beginService',
    value: [
      { name: "开始服务时间", key: "start_service_msg_time", span: '8', value: ''},
      { name: "车辆位置", key: "start_service_msg_position", span: '16', value: '', link: 'position'},
    ]
  },
  {
    title: '到达上车地点',
    key: 'arriveBoard',
    value: [
      { name: "到达时间", key: "arrive_boarding_msg_time", span: '8', value: ''},
      { name: "车辆位置", key: "arrive_boarding_msg_position", span: '16', value: '', link: 'position'},
    ]
  },
  {
    title: '乘客上车',
    key: 'passengerAboard',
    value: [
      { name: "乘客上车时间", key: "aboard_msg_time", span: '8', value: ''},
      { name: "车辆位置", key: "aboard_msg_position", span: '16', value: '', link: 'position'},
      { name: "接乘里程", key: "waitMile", span: '8', value: '', unit: '公里', type: 'number'},
      { name: "接乘时长", key: "waitTime", span: '16', value: ''},
    ]
  },
  {
    title: '途径点1',
    key: 'passingPoints',
    value: [
      { name: "到达时间", key: "passing_points_msg_time0", span: '8', value: ''},
      { name: "车辆位置", key: "passing_points_msg_position0", span: '16', value: '', link: 'position'}
    ]
  },
  {
    title: '途径点2',
    key: 'passingPoints',
    value: [
      { name: "到达时间", key: "passing_points_msg_time1", span: '8', value: ''},
      { name: "车辆位置", key: "passing_points_msg_position1", span: '16', value: '', link: 'position'}
    ]
  },
  {
    title: '途径点3',
    key: 'passingPoints',
    value: [
      { name: "到达时间", key: "passing_points_msg_time2", span: '8', value: ''},
      { name: "车辆位置", key: "passing_points_msg_position2", span: '16', value: '', link: 'position'}
    ]
  },
  {
    title: '到达目的地',
    key: 'arriveDest',
    value: [
      { name: "到达时间", key: "arrive_dest_msg_time", span: '8', value: ''},
      { name: "车辆位置", key: "arrive_dest_msg_position", span: '16', value: '', link: 'position'},
      { name: "行驶里程", key: "drivenDistance", span: '8', value: '', unit: '公里', type: 'number'},
      { name: "行驶时长", key: "drivenTime", span: '16', value: ''},
      { name: "行程里程", key: "tripDistance", span: '8', value: '', unit: '公里', type: 'number'},
      { name: "行程时长", key: "tripDuration", span: '16', value: ''},
      { name: "远途里程", key: "haulBackTrip", span: '8', value: '', unit: '公里', type: 'number'},
      { name: "夜间时段里程", key: "nightTrip", span: '16', value: '', unit: '公里', type: 'number'},
    ]
  },
  {
    title: '计费',
    key: 'cost',
    value: [
      { name: "定价规则版本", key: "xxxx", span: '8', value: '暂无', link: 'fixPrice'},
      { name: "动态折扣", key: "rate", span: '16', value: '', acount: true},
      { name: "起步费", key: "startFare", span: '8', value: '', unit: '元', type: 'number'},
      { name: "超时等待费", key: "waitFare", span: '8', value: '', unit: '元', type: 'number'},
      { name: "取消费用", key: "cancelFare", span: '8', value: '', unit: '元', type: 'number'},
      { name: "里程费", key: "overTripFare", span: '8', value: '', unit: '元', type: 'number'},
      { name: "时长费", key: "overTimeFare", span: '8', value: '', unit: '元', type: 'number'},
      { name: "远途里程费", key: "haulBackFare", span: '8', value: '', unit: '元', type: 'number'},
      { name: "夜间费", key: "nightFare", span: '8', value: '', unit: '元', type: 'number'},
      { name: "折扣费用", key: "discountFare", span: '16', value: '', unit: '元', type: 'number'},
      { name: "高速费", key: "highwayFare", span: '8', value: '', adjust: '', unit: '元', type: 'number'},
      { name: "路桥费", key: "roadBridgeFare", span: '8', value: '', adjust: '', unit: '元', type: 'number'},
      { name: "停车费", key: "parkingFare", span: '8', value: '', adjust: '', unit: '元', type: 'number'},
      { name: "其他", key: "otherFare", span: '8', value: '', adjust: '', unit: '元', type: 'number'},
      { name: "司机减免", key: "driverReliefFare", span: '16', value: '', unit: '元', type: 'number'},
      { name: "行程计费总额", key: "totalFare", span: '8', value: '', unit: '元', type: 'number'},
      { name: "退款金额", key: "xxxx", span: '16', value: '暂无'},
      { name: "客服调价", key: "customerServiceAdjustment", span: '8', value: '', unit: '元', type: 'number'},
      { name: "订单计费金额", key: "orderFare", span: '16', value: '', adjust: '', unit: '元', type: 'number'},
      { name: "优惠券抵扣金额", key: "couponAmount", span: '8', value: '', unit: '元', type: 'number'},
      { name: "优惠券编号", key: "xxxx", span: '16', value: '暂无', link: 'coupon'},
      { name: "实付金额", key: "payAmount", span: '8', value: '', unit: '元', type: 'number'},
      { name: "待乘客支付金额", key: "waitPassengerPayAmount", span: '16', value: '', unit: '元', type: 'number'},
    ]
  },
  {
    title: '支付',
    key: 'pay',
    value: [
      { name: "支付时间", key: "payTime", span: '8', value: ''},
      { name: "支付方式", key: "payType", span: '16', value: ''},
      { name: "现金（余额）", key: "balanceCash", span: '8', value: '', unit: '元', type: 'number'},
      { name: "赠送币", key: "balanceGift", span: '8', value: '', unit: '元', type: 'number'},
      { name: "第三方支付金额", key: "thirdAmount", span: '8', value: '', unit: '元', type: 'number'},
      { name: "是否申请发票", key: "billedStatus", span: '8', value: ''},
      { name: "发票编号", key: "invoiceNo", span: '8', value: '', link: 'invoice'},
      { name: "发票类型", key: "invoiceType", span: '8', value: ''},
    ]
  },
  {
    title: '首评',
    key: 'firstEvaluate',
    value: [
      { name: "评价时间", key: "evaluateTime1", span: '24', value: '' },
      { name: "司机评星", key: "evaluateStars11", span: '8', value: 0, star: true },
      { name: "平台评星", key: "evaluateStars12", span: '8', value: 0, star: true },
      { name: "车辆评星", key: "evaluateStars13", span: '8', value: 0, star: true },
      { name: "标签", key: "evaluateTags11", span: '8', value: '' }, //司机
      { name: "标签", key: "evaluateTags12", span: '8', value: '' }, //平台
      { name: "标签", key: "evaluateTags13", span: '8', value: '' }, //车辆
      { name: "评价内容", key: "evaluateContent11", span: '8', value: '', content: true }, //司机
      { name: "评价内容", key: "evaluateContent12", span: '8', value: '', content: true }, //平台
      { name: "评价内容", key: "evaluateContent13", span: '8', value: '', content: true } //车辆
    ]
  },
  {
    title: '追评',
    key: 'secondEvaluate',
    value: [
      { name: "评价时间", key: "evaluateTime2", span: '24', value: '' },
      { name: "司机评星", key: "evaluateStars21", span: '8', value: 0, star: true },
      { name: "平台评星", key: "evaluateStars22", span: '8', value: 0, star: true },
      { name: "车辆评星", key: "evaluateStars23", span: '8', value: 0, star: true },
      { name: "标签", key: "evaluateTags21", span: '8', value: '' }, //司机
      { name: "标签", key: "evaluateTags22", span: '8', value: '' }, //平台
      { name: "标签", key: "evaluateTags23", span: '8', value: '' }, //车辆
      { name: "评价内容", key: "evaluateContent21", span: '8', value: '', content: true }, //司机
      { name: "评价内容", key: "evaluateContent22", span: '8', value: '', content: true }, //平台
      { name: "评价内容", key: "evaluateContent23", span: '8', value: '', content: true } //车辆
    ]
  }
]

/** 订单详情-右侧 */
export const orderRightData = [
  {
    title: '基本信息',
    key: 'basicInfo',
    value: [
      { name: "订单状态", key: "mainStatus", span: '12', value: '' },
      { name: "业务类型", key: "typeModule", span: '12', value: '' },
      { name: "订单编号", key: "routeNo", span: '24', value: '' },
      { name: "订单类型", key: "typeTime", span: '12', value: '' },
      { name: "是否代叫车", key: "typeSelf", span: '12', value: '' },
      { name: "出发地", key: "originDetailAddress", span: '24', value: '' },
      { name: "目的地", key: "destDetailAddress", span: '24', value: '' },
      { name: "途径点1", key: "address0", span: '24', value: '' },
      { name: "途径点2", key: "address1", span: '24', value: '' },
      { name: "途径点3", key: "address2", span: '24', value: '' },
      { name: "预约用车时间", key: "departTime", span: '24', value: '' }
    ]
  },
  {
    title: '司乘&车辆信息',
    key: 'driverInfo',
    value: [
      { name: "下单人姓名", key: "passengerName", span: '12', value: '', link: 'passenger', uuid: '' },
      { name: "下单人手机号", key: "passengerMobile", span: '12', value: '' },
      { name: "乘车人姓名", key: "actualPassengerName", span: '12', value: '' },
      { name: "乘车人手机号", key: "actualPassengerMobile", span: '12', value: '' },
      { name: "司机姓名", key: "actualDriverName", span: '12', value: '', link: 'driver', uuid: '' },
      { name: "司机手机号", key: "actualDriverMobile", span: '12', value: '' },
      { name: "车牌号", key: "plateNum", span: '12', value: '' },
      { name: "车型名称", key: "carModel", span: '12', value: '' },
      { name: "车辆VIN码", key: "vin", span: '24', value: '', link: 'vin' }
    ]
  },
  {
    title: '取消信息',
    key: 'cancelInfo',
    value: [
      { name: "取消时间", key: "cancelTime", span: '24', value: '' },
      { name: "取消类型", key: "cancelType", span: '12', value: '' },
      { name: "取消方", key: "creatorType", span: '12', value: '' },
      { name: "取消原因", key: "cancelReason", span: '24', value: '24', content: true }
    ]
  }
]

export const showMap = {
  0: ['placeOrder', 'beginService', 'basicInfo'],
  1: ['placeOrder', 'beginService', 'basicInfo'],
  2: ['placeOrder','distributOrder', 'receiveOrder', 'beginService', 'basicInfo', 'driverInfo'],
  3: ['placeOrder','distributOrder', 'receiveOrder', 'beginService', 'arriveBoard', 'basicInfo', 'driverInfo'],
  4: ['placeOrder','distributOrder', 'receiveOrder', 'beginService', 'arriveBoard', 'passengerAboard', 'passingPoints', 
      'basicInfo', 'driverInfo'],
  5: ['placeOrder','distributOrder', 'receiveOrder', 'beginService', 'arriveBoard', 'passengerAboard', 'passingPoints', 
      'arriveDest', 'basicInfo', 'driverInfo'],
  6: ['placeOrder','distributOrder', 'receiveOrder', 'beginService', 'arriveBoard', 'passengerAboard', 'passingPoints', 
      'arriveDest', 'cost', 'basicInfo', 'driverInfo'],
  7: ['placeOrder','distributOrder', 'receiveOrder', 'beginService', 'arriveBoard', 'passengerAboard', 'passingPoints', 
      'arriveDest', 'cost', 'pay', 'basicInfo', 'driverInfo'],
  8: ['placeOrder','distributOrder', 'receiveOrder', 'beginService', 'arriveBoard', 'passengerAboard', 'passingPoints', 
      'arriveDest', 'cost', 'pay', 'firstEvaluate', 'basicInfo', 'driverInfo'],
  9: ['placeOrder', 'distributOrder', 'receiveOrder', 'beginService', 'basicInfo', 'driverInfo', 'cancelInfo']
}