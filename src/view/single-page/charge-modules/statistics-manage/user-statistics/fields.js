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
      title: '司机ID',
      key: 'uuid',
      ellipsis: true,
      tooltip: true,
      minWidth: 270
    },
    protocolName: {
      title: '司机姓名',
      key: 'protocolName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    startTime: {
      title: '所属运营商',
      key: 'operator',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    endTime: {
      title: '所属司管',
      key: 'copName',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    carNum: {
      title: '绑定车牌号',
      key: 'carNum',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    carNum1: {
      title: '消费金额',
      key: 'carNum1',
      ellipsis: true,
      tooltip: true,
      minWidth: 140,
      sortable: true
    },
    carNum12: {
      title: '时间',
      key: 'carNum12',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    }
  }
}
