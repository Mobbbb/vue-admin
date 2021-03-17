import { businessLineMap } from '../../fields'
let typeList = [
  {
    value: '1',
    label: '折扣券'
  },
  {
    value: '2',
    label: '抵扣券'
  }
]
let inputList = [
  {
    name: "text-input",
    bind_key: "templateName",
    placeholder: "请输入名称",
    value: "",
    title: "券模板名称：",
    titleWidth: 80,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "text-input",
    bind_key: "templateCode",
    placeholder: "请输入编码",
    value: "",
    title: "券模板编码：",
    titleWidth: 80,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "templateType", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "券类型：", // 展示的字段名
    dropList: typeList,
    titleWidth: 50, // 展示的字段名的宽度
    inputWidth: 120, // input框的宽度
    key: "1", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: "text-input",
    bind_key: "creator",
    placeholder: "请输入创建人",
    value: "",
    title: "创建人：",
    titleWidth: 50,
    inputWidth: 150, // input框的宽度
    key: "6",
    isHide: false
  }
]

// tableb表头信息
let parColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '券模板名称',
    key: 'templateName',
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: '券模板编码',
    key: 'templateCode',
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: '券类型',
    key: 'templateType',
    ellipsis: true,
    tooltip: true,
    minWidth: 80,
    render: (h, params) => {
      return h('div', params.row.templateType===1?'折扣券':'抵扣券')
    }
  },
  {
    title: '业务线',
    key: 'businessTypeList',
    ellipsis: true,
    tooltip: true,
    minWidth: 120,
    render: (h, params) => {
      let list = []
      params.row.businessTypeList.forEach(item=>{
        list.push(businessLineMap[item])
      })
      return h('div', list.join('、'))
    }
  },
  {
    title: '券面额',
    key: 'couponMoney',
    ellipsis: true,
    tooltip: true,
    minWidth: 80,
    render: (h, params) => {
      let text = '暂无'
      if (params.row.templateType === 1) { // 折扣券
          text = '最高抵扣' + params.row.highestMoney + '元'
      } 
      if (params.row.templateType === 2) { // 抵扣券
          text = params.row.couponMoney + '元'
      }
      return h('span', text)
    }
  },
  {
    title: '用券规则',
    key: 'rule',
    ellipsis: true,
    tooltip: true,
    minWidth: 140,
    render: (h, params) => {
      let text = '暂无'
      if (params.row.templateType === 1) { // 折扣券
        text = params.row.discount + '折'
      }
      if (params.row.templateType === 2) { // 抵扣券
        if (params.row.needCondition === 0) { // 不限门槛
          text = '不限门槛'
        } else { // 限制门槛
          text = '满' + params.row.conditionMoney + '元可用'
        }
      }
      return h('span', text)
    }
  },
  {
    title: '创建人',
    key: 'creator',
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  }
]

export const cacheData = {
  inputList,
  pageObj: {
    total: 0,
    current: 1,
    pageSize: 10
  },
  searchData: {},
  parColumns,
  tableData: [],
  selectedList: []
}