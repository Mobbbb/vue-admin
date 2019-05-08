export const returnFields = (that) => {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    parColumns: [
      {
        title: '序号',
        key: 'num',
        tooltip: true,
        width: 70,
        fixed: 'left',
        render: (h, params) => {
          return h('div', that.pageSize*(that.current-1) + params.index + 1)
        }
      },
      {
        title: '名称',
        key: 'name',
        tooltip: true,
        minWidth: 150,
        fixed: 'left'
      },
      {
        title: '城市',
        key: 'city',
        minWidth: 150,
        tooltip: true,
        render: (h, params) => {
          let cityCode = params.row.cityCode
          const getCityName = cityCode => {
            let newJSON = {}
            that.cityList.forEach(item => {
              item.children && item.children.length && item.children.forEach(element => {
                newJSON[element.cityID] = element.__label
              })
            });
            return newJSON[cityCode] || '暂无'
          }
          return h('div', getCityName(cityCode))
        }
      },
      {
        title: '业务类型',
        key: 'serviceType',
        tooltip: true,
        minWidth: 150,
        render: (h, params) => {
          let newtitles = ''
          switch (params.row.serviceType) {
            // case 5:
            //   newtitles = '全部';
            //   break;
            case 4:
              newtitles = '快车';
              break;
            case 2:
              newtitles = '专车';
              break;
            case 1:
              newtitles = '出租车';
              break;
            default:
              newtitles = '暂无';
          }
          return h('div', newtitles)
        }
      },
      {
        title: '围栏类型',
        key: 'railType',
        tooltip: true,
        minWidth: 150,
        render: (h, params) => {
          const railTypeMap = {
            // 0: '全部',
            1: '运营围栏',
            2: '流水奖励围栏'
          }
          return h('div', railTypeMap[params.row.railType] || '暂无')
        }
      },
      {
        title: '创建时间',
        key: 'createTime',
        minWidth: 150,
        tooltip: true
      },
      {
        title: '生效时间',
        key: 'effectiveTime',
        minWidth: 150,
        tooltip: true
      },
      {
        title: '失效时间',
        key: 'failureTime',
        minWidth: 150,
        tooltip: true
      },
      {
        title: '状态',
        key: 'status',
        tooltip: true,
        minWidth: 150,
        render: (h, params) => {
          let statusTitle = ''
          switch (params.row.status) {
            case 1:
              statusTitle = '正常';
              break;
            case 2:
              statusTitle = '未生效';
              break;
            case 3:
              statusTitle = '失效';
              break;
            default:
              statusTitle = '暂无';
          }
          return h('div', statusTitle)
        }
      },
      {
        title:'操作',
        key:'action',
        fixed: 'right',
        width: 150,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              'class':{
                tableBtn: true
              },
              props: {
                type: "warning",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: 'hasAuth',
                value: 'elecfence_control-edit'
              }],
              on: {
                click: () => {
                  let paramData = params.row
                  let newJSON = {
                    name: '',
                    carrierArea: [],
                    serviceType: '',
                    railType: '运营围栏',
                    scope: '',
                    scopes: '',
                    getpathData: [],
                    effectiveTime: '',
                    failureTime: '',
                    remark: '',
                    status: 0
                  }
                  let newArrayBox = []
                  that.title = '编辑电子围栏'
                  that.updateType = 'edit'
                  that.uuid = paramData.uuid
                  for (let key in newJSON) {
                    newJSON[key] = paramData[key]
                  }
                  newJSON.scopes = paramData.scope
                  newJSON.getpathData = paramData.scope.split('&')
                  newJSON.carrierArea = [paramData.provinceCode, paramData.cityCode]
                  that.floatParams = newJSON
                  that.isPop = true
                  that.invalidEditor = false
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: "info",
                ghost: true,
                size: "small"
              },
              directives: [{
                name: 'hasAuth',
                value: 'elecfence_control-detail'
              }],
              on: {
                click: () => {
                  let paramData = params.row
                  let newJSON = {
                    name: '',
                    carrierArea: [],
                    serviceType: '',
                    railType: '',
                    scope: '',
                    getpathData: [],
                    effectiveTime: '',
                    failureTime: '',
                    remark: '',
                    status: 0
                  }
                  let newArrayBox = []
                  that.title = '查看电子围栏'
                  for (let key in newJSON) {
                    newJSON[key] = paramData[key]
                  }
                  newJSON.scopes = paramData.scope
                  newJSON.getpathData = paramData.scope.split('&')
                  newJSON.carrierArea = [paramData.provinceCode, paramData.cityCode]
                  that.floatParams = newJSON
                  that.isPop = true
                  that.invalidEditor = true
                }
              }
            }, '详情')
          ])
        }
      }
    ]
  }
}
export const inputList = [
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'name', // 返回数据的key名
    placeholder: '请输入名称',
    value: '', // 用于数据绑定
    title: '名称：', // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'cascader-input', // 文本输入框名
    bind_key: ['provinceId', 'cityId'], // 返回数据的key名
    placeholder: '请选择省/市',
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: '省 / 市：', // 展示的字段名
    titleWidth: 60, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '2', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false, // false: 不隐藏 / true: 隐藏
    changeOnSelect: true
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'serviceType', // 返回数据的key名
    placeholder: '请选择业务类型',
    value: '', // 绑定返回数据
    dropList: [], // 级联列表
    title: '业务类型：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '3', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'railType', // 返回数据的key名
    placeholder: '请选择围栏类型',
    value: '', // 绑定返回数据
    dropList: [], // 级联列表
    title: '围栏类型：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '4', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'time-input', // 文本输入框名
    bind_key: 'millis', // 返回数据的key名
    placeholder: '请选择创建时间',
    value: '', // 绑定返回数据
    title: '创建时间：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '5', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'status', // 返回数据的key名
    placeholder: '请选择状态',
    value: '', // 绑定返回数据
    dropList: [], // 级联列表
    title: '状态：', // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '6', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  }
]
