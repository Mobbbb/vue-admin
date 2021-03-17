// table配置
export const returnFields = (that) => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    updateDate: {
      title: '充值时间',
      key: 'updateDate',
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    payOrderType: {
      title: '来源',
      key: 'payOrderType',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        switch (Number(params.row.payOrderType)) {
          case 1:
            return h('div', '企业充值')
          case 2:
            return h('div', '个人充值')
          default:
            return false
        }
      }
    },
    rechargeAmout: {
      title: '金额(元)',
      key: 'rechargeAmout',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    payChannel: {
      title: '充值方式',
      key: 'payChannel',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        switch (Number(params.row.payChannel)) {
          case 1:
            return h('div', '支付宝')
          case 2:
            return h('div', '微信')
          default:
            return false
        }
      }
    }
  }
}
// 搜索列表
export const inputList = [
  {
    name: "drop-input",
    bind_key: "payOrderType",
    placeholder: "请选择来源",
    dropList: [
      {
        value: "",
        label: "全部"
      },
      {
        value: 1,
        label: "企业充值"
      },
      {
        value: 2,
        label: "个人充值"
      }
    ],
    value: "",
    title: "来源：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "month-input",
    bind_key: "updateDate",
    placeholder: "请选择月份",
    editable: false,
    value: "",
    title: "选择月份：",
    options: {},
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  }
] //搜索列表