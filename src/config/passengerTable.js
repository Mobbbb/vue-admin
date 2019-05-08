/**
 * 用户信息模块
 */

/** 性别 */
export const sexMap = {
  1: '男',
  2: '女'
}

/** 用户账号状态 */
export const statusMap = {
  0: '正常',
  1: '封号',
  2: '冻结'
}

/** 是否实名 */
export const realnameOrNotMap = {
  'true': '已实名',
  'false': '未实名'
}

/** 
* 订单记录 
*/
/** 订单类型 */
export const orderTypeMap = {//刘锣康定义
  1: '实时',
  2: '预约'
  // 1: '出租车',
  // 2: '专车',
  // 3: '拼车',
  // 4: '快车',
  // 5: '货的',
  // 6: '骑手',
  // 7: '搬家'
}

/** 订单状态 */
export const orderStatusMap = {
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
/** 充值记录  支付方式 */
export const payPatternMap = {
  1: '支付宝',
  2: '微信',
  3: '一网通',
  4: '余额',
  5: '优惠券抵扣',
  6: '线下支付',
  7: '营销或者客服操作',
  8: '银联支付'
}

/**
 * 消费记录
 */
/** 消费类型 */
export const consumeTypeMap = {
  1: '行程车费支付-线上',
  2: '充值',
  3: '购卡',
  4: '行程车费支付-线下',
  5: '行程车费支付-自动扣款',
  6: '电费支付',
  7: '充电账户充值',
  8: '客服直接赠送',
  9: '营销直接赠送'
}

/**
 * 紧急联系人
 */
/** 是否自动分享 */
export const autoShareOrNotMap = {
  'true': '是',
  'false': '否'
}

/**
 * 行程分享记录
 */
/** 分享类型 */
export const shareTypeMap = {
  1: '自动',
  2: '手动'
}

/**
 * 优惠券模板
 */

 /** 类型 */
 export const couponTypeMap = {
  1: '折扣券',
  2: '抵扣券'
 }

 /** 业务类型 */
 export const useTypeMap = {
   1: '出租车',
   2: '专车',
   4: '快车'
 }

 /** 业务限制 */
 export const useLimitMap = {
   1: '实时',
   2: '预约'
 }

/** 优惠券模板状态 */
export const couponTempleteMap = {
  1: '可用',
  2: '不可用'
}

 /** 优惠券状态 */
 export const couponStatusMap = {
   0: '未用',
   1: '已用',
   2: '已过期'
 }

/** 评价类型 */
export const orderCommentMap = {
  1: '司机',
  2: '平台',
  3: '车辆'
}

/** 广告状态 */
export const adStatusMap = {
  1: '未开始',
  2: '在线中',
  3: '已结束',
  4: '已关闭'
}

/** 活动状态 */
export const activeStatusMap = {
  1: '未开始',
  2: '在线中',
  3: '已结束',
  4: '已关闭'
}

/** 推荐人角色 */
export const roleMap = {
  1: '司机',
  2: '乘客'
}