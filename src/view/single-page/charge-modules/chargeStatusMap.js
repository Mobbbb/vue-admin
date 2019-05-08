// 订单状态，
export const orderStatusMap = {
  1: '发起充电请求(结果未知)',
  2: '发起充电失败',
  3: '充电中',
  4: '待支付',
  5: '已完成',
  6: '停止中',
  7: '停止失败'
}

// 订单状态列表
export const orderStatusList = []
Object.keys(orderStatusMap).forEach(strKey => {
  let key = Number(strKey)
  orderStatusList.push({
    value: key,
    label: orderStatusMap[key]
  })
});
// 345放在前面是因为产品需求列表优先展示345,
let orderStatusBefore = orderStatusList.splice(2,3)
orderStatusList.unshift(...orderStatusBefore)
