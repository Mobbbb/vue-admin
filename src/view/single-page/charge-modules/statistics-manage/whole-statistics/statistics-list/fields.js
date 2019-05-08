/* 公共服务-会员服务-账号基本信息 */
export const returnFields = (that) => {
  return {
    idxs: {
      title: '序号',
      key: 'idxs',
      ellipsis: true,
      tooltip: true,
      width: 70
    },
    uuid: {
      title: '时间',
      key: 'uuid',
      ellipsis: true,
      tooltip: true,
      minWidth: 270
    },
    protocolName: {
      title: '品牌',
      key: 'protocolName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    orderNum: {
      title: '城市',
      key: 'orderNum',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    startTime: {
      title: '运营商',
      key: 'startTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    chargeElectric: {
      title: '充电量(度)',
      key: 'chargeElectric',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    chargeFees: {
      title: '充电收入(元)',
      key: 'chargeFees',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    chargeFees1: {
      title: '账户余额支付(元)',
      key: 'chargeFees1',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    chargeFees2: {
      title: '支付宝支付(元)',
      key: 'chargeFees2',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    chargeFees3: {
      title: '微信支付(元)',
      key: 'chargeFees3',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    }
  }
}
