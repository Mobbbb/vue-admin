// 是否申请发票
export const drawBillMap = {
  0: '待开票',
  1: '已开票',
}

// 发票类型
export const invoiceTypeMap = {
  1: '电子发票',
  2: '纸质发票'
}

// 订单类型
export const typeTimeMap = {
	1: '实时',
  	2: '预约'
}

// 取消方
export const creatorTypeMap = {
	1: '乘客APP',
  	2: '司机APP',
  	3: '呼叫中心'
}

// 取消类型
export const cancelTypeMap = {
	0: '乘客无责取消',
  	1: '乘客政策免费取消',
  	2: '乘客使用免费次数取消',
  	3: '乘客付费取消',
  	4: '超时自动取消'
}

// 支付方式
export const payTypeMap = {
  	1: '支付宝',
  	2: '微信',
  	3: '一网通',
  	4: "余额",
	5: "优惠券",
	6: "线下支付",
	7: '营销或者客服操作',
	8: '银联支付'
}

// 订单状态 
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

// 业务类型
export const typeModuleMap = {
	1: "出租车",
	2: "专车",
	3: "拼车",
	4: "载乘中",
	5: "快车"
}

// 性别
export const sexMap = {
  	1: '男',
  	2: '女'
}

// 实名状态
export const dautoynmStatusMap = {
	0: '待实名',
  	1: '已实名阶段A',
  	2: '已实名阶段B'
}

// 用户账号状态
export const accountStatusMap = {
	0: '正常',
	1: '黑名单',
	2: '临时冻结'
}

// 消费类型
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

// 分享类型
export const shareTypeMap = {
  	1: '自动',
  	2: '手动'
}

// 优惠券类型
export const couponTypeMap = {
  	1: '折扣券',
  	2: '抵扣券'
}

// 优惠券状态
export const couponStatusMap = {
	1: '未使用',
	2: '已使用'
}

// 充值类型
export const rechargeTypeMap = {
	2: '个人充值',
	3: '客户充值',
	4: '活动奖励'
}

// 封号类型
export const freezeTypeMap = {
	1: '封号',
	2: '解封',
	3: '拉黑',
	4: '移除黑名单',
	5: '离职',
	6: '复职',
	7: '冻结',
	8: '解冻', 
	9: '入职', 
	10: '强制下线',
	11: '允许上线'
}

// 注册来源
export const registerSourceMap = {
	1: '营销',
	2: '分享'
}