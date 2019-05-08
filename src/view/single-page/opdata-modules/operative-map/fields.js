/* 公共服务-会员服务-账号基本信息 */
export const returnFields = (that) => {
  return {
    createTime: {
      title: '下单时间',
      key: 'createTime',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      render: (h, params) => {
        let titles = params.row.createTime || '暂无'
        return h('div', titles)
      }
    },
    passengerName: {
      title: '乘车人姓名/电话',
      key: 'passengerName',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      // width: 180,
      render: (h, params) => {
        let titles = (params.row.passengerName + '/' + params.row.passengerMobile) || '暂无'
        return h('div', titles)
      }
    },
    driverName: {
      title: '司机姓名/电话',
      key: 'driverName',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      // width: 140,
      render: (h, params) => {
        let titles = (params.row.driverName + '/' + params.row.driverMobile) || '暂无'
        return h('div', titles)
      }
    },
    originAddress  : {
      title: '出发地',
      key: 'originAddress  ',
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
    mainStatus  : {
      title: '订单状态',
      key: 'mainStatus  ',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      // width: 110,
      render: (h, params) => {
        var titles = '暂无'
        switch (params.row.mainStatus  ) {
          case 1:
            titles = '初始化';
            break;
          case 2:
            titles = '进行中';
            break;
          case 3:
            titles = '结束（待支付）';
            break;
          case 4:
            titles = '支付完成';
            break;
          case 5:
            titles = '取消';
            break;
        }
        return h('div', titles)
      }
    },
    planFare: {
      title: '订单金额',
      key: 'planFare',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      // width: 100
    },
    action: {
      title: '订单编号',
      key: 'action',
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
