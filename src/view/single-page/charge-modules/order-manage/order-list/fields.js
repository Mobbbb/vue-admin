import { orderStatusMap, orderStatusList } from '../../chargeStatusMap'
// table配置
export const returnFields = (that) => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    driverId: {
      title: '司机ID',
      key: 'driverId',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    driverName: {
      title: '司机姓名',
      key: 'driverName',
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    orderNo: {
      title: '订单编号',
      key: 'orderNo',
      ellipsis: true,
      tooltip: true,
      minWidth: 240
    },
    startDate: {
      title: '充电开始',
      key: 'startDate',
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    endDate: {
      title: '充电结束',
      key: 'endDate',
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    totalTime: {
      title: '充电时长',
      key: 'totalTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 110
    },
    fee: {
      title: '电费合计(元)',
      key: 'fee',
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    degree: {
      title: '电量(度)',
      key: 'degree',
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    price: {
      title: 'T3单价(元/度)',
      key: 'price',
      ellipsis: true,
      tooltip: true,
      minWidth: 110
    },
    costPrice: {
      title: '成本价(元/度)',
      key: 'costPrice',
      ellipsis: true,
      tooltip: true,
      minWidth: 110
    },
    marketPrice: {
      title: '市场价(元/度)',
      key: 'marketPrice',
      ellipsis: true,
      tooltip: true,
      minWidth: 110
    },
    status: {
      title: '状态',
      key: 'status',
      ellipsis: true,
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        return h('div', orderStatusMap[params.row.status])
      }
    },
    carNo: {
      title: '车牌号',
      key: 'carNo',
      ellipsis: true,
      tooltip: true,
      minWidth: 110
    },
    brandName: {
      title: '品牌',
      key: 'brandName',
      ellipsis: true,
      tooltip: true,
      minWidth: 110
    },
    pileCode: {
      title: '电桩编号',
      key: 'pileCode',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
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
              value: 'order-list-detail'
            }],
            on: {
              click: () => {
                that.$router.push('/chargeCenter/order/order-detail/' + params.row.uuid);
              }
            }
          }, '详情')
        ])
      }
    }
  }
}
// 搜索配置
export const inputList = [
  {
    name: "text-input",
    bind_key: "driverId",
    placeholder: "请输入司机ID",
    value: "",
    title: "司机ID：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "driverName",
    placeholder: "请输入司机姓名",
    value: "",
    title: "司机姓名：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "orderNo",
    placeholder: "请输入订单编号",
    value: "",
    title: "订单编号：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "pileCode",
    placeholder: "请输入电桩编号",
    value: "",
    title: "电桩编号：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "carNo",
    placeholder: "请输入车牌号",
    value: "",
    title: "车牌号：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "drop-input",
    bind_key: "brandName",
    placeholder: "请选择品牌",
    dropList: [],
    value: "",
    title: "品牌：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "drop-input",
    bind_key: "status",
    placeholder: "请选择状态",
    dropList: orderStatusList,
    value: "",
    title: "状态：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "date-input", // 文本输入框名
    bind_key: "date", // 返回数据的key名
    placeholder: "请选择日期",
    value: "", // 用于数据绑定
    title: "选择日期：", // 展示的字段名
    titleWidth: 60, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    options: {},
    key: "6", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  }
]
export const searchData = {}
export const pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}