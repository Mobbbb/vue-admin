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
      minWidth: 120
    },
    driverMobile: {
      title: '手机号',
      key: 'driverMobile',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    agentName: {
      title: '所属运营商',
      key: 'agentName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    managerDriverName: {
      title: '所属司管',
      key: 'managerDriverName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    plateNum: {
      title: '车牌号',
      key: 'plateNum',
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
        return h('div',[
          h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            directives: [{
              name: 'hasAuth',
              value: 'account-list-detail'
            }],
            on: {
              click: () => {
                that.$router.push('/chargeCenter/account/driver-detail/'+params.row.uuid)
              }
            }
          }, '详情')
        ])
      }
    }
  }
}
// 搜索部分配置
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
    bind_key: "driverMobile",
    placeholder: "请输入手机号",
    value: "",
    title: "手机号：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "plateNum",
    placeholder: "请输入车牌号",
    value: "",
    title: "车牌号：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "managerDriverName",
    placeholder: "请输入司管姓名",
    value: "",
    title: "司管姓名：",
    titleWidth: 60,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceID", "cityID", 'agentUuid'], // 返回数据的key名
    placeholder: "请选择省/市/所属运营商",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "所属运营商：", // 展示的字段名
    titleWidth: 80, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: "6", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false, // false: 不隐藏 / true: 隐藏
    changeOnSelect: true
  }
]

export const pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}
export const searchData = {}