import {
  axiosSwitchPrice
} from "@/api/charge.js";
// tableb表头信息
export const returnFields = (that) => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    cityName: {
      title: '城市',
      key: 'cityName',
      ellipsis: true,
      tooltip: true,
      minWidth: 80
    },
    brandName: {
      title: '品牌',
      key: 'brandName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    price: {
      title: '单价(元/度)',
      key: 'price',
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    chargingPrice: {
      title: '电费(元/度)',
      key: 'chargingPrice',
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    servicePrice: {
      title: '服务费(元/度)',
      key: 'servicePrice',
      ellipsis: true,
      tooltip: true,
      minWidth: 100
    },
    setTime: {
      title: '设置时间',
      key: 'setTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    startTime: {
      title: '启用时间',
      key: 'startTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 160
    },
    status: {
      title: '状态',
      key: 'status',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        switch (Number(params.row.status)) {
          case 1:
            return h('div', '停用')
          case 2:
            return h('div', '启用中')
          case 0:
            return h('div', '未启用')
          default:
            return false
        }
      }
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 140,
      render: (h, params) => {
        let editBtn = h('Button', {
          props: {
            type: "warning",
            ghost: true,
            size: "small"
          },
          'class': {
            tableBtn: true
          },
          directives: [{
            name: 'hasAuth',
            value: 'price-control-edit'
          }],
          on: {
            click: () => {
              let addPriceParams = that.addPriceParams
              let paramsrow = params.row

              for (let key in addPriceParams) {
                addPriceParams[key] = paramsrow[key]
              }
              addPriceParams.uuid = paramsrow.uuid
              addPriceParams.brandName = paramsrow.brandName
              // 表单验证需要string类型，后台给的number
              addPriceParams.chargingPrice = String(addPriceParams.chargingPrice)
              addPriceParams.servicePrice = String(addPriceParams.servicePrice)

              that.startTime = addPriceParams.startTime
              that.addPriceParams = addPriceParams
              that.addPriceParams.name = 'addPriceParams'
              that.editorModal = true
              that.changeTime = false
              that.newMobel = true
            }
          }
        }, '编辑')
        let switchBtn = h('Button', {
          props: {
            type: Number(params.row.status) === 2 ? 'error' : 'success',
            ghost: true,
            size: "small"
          },
          directives: [{
            name: 'hasAuth',
            value: 'price-control-switch'
          }],
          on: {
            click: () => {
              that.$Modal.confirm({
                title: Number(params.row.status) === 2 ? '确认停用此定价' : '确认启用此定价',
                content: `<div>城市：${params.row.cityName}</div><div>品牌：${params.row.brandName}</div><div>电费：${params.row.chargingPrice} 元/度</div><div>服务费：${params.row.servicePrice} 元/度</div><div>单价：${params.row.price} 元/度</div><div>启用时间：${params.row.startTime}</div>`,
                onOk: () => {
                  let param = {
                    uuid: params.row.uuid,
                    status: Number(params.row.status) === 2 ? 1 : 2
                  }
                  axiosSwitchPrice(param).then(res => {
                    if (res.data.success) {
                      that.$Message.success(res.data.msg);
                      that.getList()
                    } else {
                      that.$Message.error(res.data.msg);
                    }
                  })
                }
              })
            }
          }
        }, Number(params.row.status) === 2 ? '停用' : '启用')
        // 根据状态，配置不同按钮
        let status = Number(params.row.status)
        if (status === 1) {
          return h('div', [switchBtn])
        } else {
          return h('div', [editBtn, switchBtn])
        }
      }
    }
  }
}

// 搜索列表
export const inputList = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "cityId", // 返回数据的key名
    placeholder: "请选择城市",
    value: "", // 用于数据绑定
    title: "城市：", // 展示的字段名
    dropList: [],
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 150, // input框的宽度
    key: "1", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "supplierId", // 返回数据的key名
    placeholder: "请选择品牌",
    value: "", // 用于数据绑定
    title: "品牌：", // 展示的字段名
    dropList: [],
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 150, // input框的宽度
    key: "1", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    value: "", // 用于数据绑定
    title: "状态：", // 展示的字段名
    dropList: [
      {
        label: "停用",
        value: 1
      },
      {
        label: "启用中",
        value: 2
      },
      {
        label: "未启用",
        value: 0
      }
    ],
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 150, // input框的宽度
    key: "1", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  }
]

// 表单校验
export const addPriceParamsRule = {
  cityName: [
    { required: true, message: "城市不能为空", trigger: "change" }
  ], //城市（已开通城市）
  supplierId: [
    { required: true, message: "供应商不能为空", trigger: "change" }
  ], //供应商（合作的）
  chargingPrice: [
    { required: true, message: "电费不能为空", trigger: "blur" }
  ], //电费
  servicePrice: [
    { required: true, message: "服务费不能为空", trigger: "blur" }
  ] //服务费
}
// 合作的供应商列表
export const supplierList = []
// 合作的城市列表
export const cityList = []
export const searchData = {}
export const pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}