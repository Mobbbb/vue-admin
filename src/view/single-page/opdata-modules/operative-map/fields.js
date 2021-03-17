/* 公共服务-会员服务-账号基本信息 */
export const returnFields = (that) => {
  return {
    // createTime: {
    //   title: '下单时间',
    //   key: 'createTime',
    //   ellipsis: true,
    //   tooltip: true,
    //   align: 'center',
    //   render: (h, params) => {
    //     let titles = params.row.createTime || '暂无'
    //     return h('div', titles)
    //   }
    // },
    passengerName: {
      title: '下单人姓名',
      key: 'passengerName',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      // width: 180,
      render: (h, params) => {
        let titles = params.row.passengerName || '暂无'
        return h('div', titles)
      }
    },
    passengerMobile: {
      title: '下单人手机',
      key: 'passengerMobile',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      // width: 180,
      render: (h, params) => {
        let titles = params.row.passengerMobile || '暂无'
        return h('div', titles)
      }
    },
    // driverName: {
    //   title: '司机姓名/电话',
    //   key: 'driverName',
    //   ellipsis: true,
    //   tooltip: true,
    //   align: 'center',
    //   // width: 140,
    //   render: (h, params) => {
    //     let titles = (params.row.driverName + '/' + params.row.driverMobile) || '暂无'
    //     return h('div', titles)
    //   }
    // },
    originAddress: {
      title: '出发地',
      key: 'originAddress',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      // width: 200
    },
    destAddress: {
      title: '目的地',
      key: 'destAddress',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      // width: 200
    },
    // mainStatus: {
    //   title: '订单状态',
    //   key: 'mainStatus',
    //   ellipsis: true,
    //   tooltip: true,
    //   align: 'center',
    //   // width: 110,
    //   render: (h, params) => {
    //     //订单主状态 
    //     const orderMainStatusMap = {
    //       0: "约车中",
    //       1: "预约中",
    //       2: "接乘中",
    //       3: "已抵达接乘地",
    //       4: "载乘中",
    //       5: "已抵达目的地",
    //       6: "待支付",
    //       7: "待评价",
    //       8: "行程结束",
    //       9: "行程取消"
    //     }
    //     return h('div', orderMainStatusMap[params.row.mainStatus] || '暂无')
    //   }
    // },
    // planFare: {
    //   title: '订单金额',
    //   key: 'planFare',
    //   ellipsis: true,
    //   tooltip: true,
    //   align: 'center',
    //   // width: 100
    // },
    action: {
      title: '订单编号',
      key: 'action',
      align: 'center',
      width: 200,
      render: (h, params) => {
        return h('div', [
          h('span', {
            style: {
              color: '#1890FF',
              cursor: 'pointer',
              marginLeft: '10px'
            },
            on: {
              click: () => {
                that.$router.push({ name: 'order-detail', params: { id: params.row.uuid } })
              }
            }
          }, params.row.routeNo)
        ])
      }
    }
  }
}
