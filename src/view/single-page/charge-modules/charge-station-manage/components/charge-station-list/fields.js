// table配置
export const returnFields = (that) => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    stationName: {
      title: '站点名称',
      key: 'stationName',
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    stationCode: {
      title: '编号',
      key: 'stationCode',
      ellipsis: true,
      tooltip: true,
      minWidth: 80
    },
    cityName: {
      title: '分布城市',
      key: 'cityName',
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    area: {
      title: '分布区',
      key: 'area',
      ellipsis: true,
      tooltip: true,
      minWidth: 110
    },
    businessHours: {
      title: '营业时间',
      key: 'businessHours',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    parkFee: {
      title: '停车收费情况',
      key: 'parkFee',
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    fastChargesNum: {
      title: '快充数量',
      key: 'fastChargesNum',
      ellipsis: true,
      tooltip: true,
      minWidth: 60
    },
    slowChargesNum: {
      title: '慢充数量',
      key: 'slowChargesNum',
      ellipsis: true,
      tooltip: true,
      minWidth: 60
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            directives: [{
              name: 'hasAuth',
              value: 'charge-station-detail'
            }],
            on: {
              click: () => {
                that.$router.push('/chargeCenter/charge-station-detail/' + params.row.uuid)
              }
            }
          }, '详情')
        ])
      }
    }
  }
}
