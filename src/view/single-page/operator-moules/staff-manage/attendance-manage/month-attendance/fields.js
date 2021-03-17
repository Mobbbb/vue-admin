export const tableTitle = (that)=>{
  return [
    {
      title: '运营区域',
      key: 'cityName',
      tooltip: true,
      minWidth: 100,
      fixed: 'left'
    },
    {
      title: '运营商',
      key: 'agnetName',
      tooltip: true,
      minWidth: 180
    },
    {
      title: '司机姓名',
      key: 'driverName',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '司机手机号',
      key: 'driverMobile',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '司机编号',
      key: 'driverNo',
      tooltip: true,
      minWidth: 100
    },
    {
      title: '考勤月份',
      key: 'statDay',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '有效出勤天数',
      key: 'attendanceDays',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '考勤结果',
      key: 'isAttendence',
      tooltip: true,
      width: 120,
      render:(h, params) =>{
        let isAttendances = ['未达标', '达标']
        return h('span', isAttendances[params.row.isAttendance])
      }
    },
    {
      title: '考勤规则版本',
      key: 'version',
      tooltip: true,
      width: 150,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "text",
              ghost: true,
              size: "small"
            },
            style:{color: '#2d8cf0',textDecoration: 'underline',display: params.row.version && params.row.cityName ?'inline-block':'none'},
            on: {
              click: () => {
                let date = new Date(that.queryAjaxPramas.statDay)
                that.detailParams = {
                  cityName: params.row.cityName,
                  examineType: 'M',
                  versionNumber: Number(params.row.version.slice(1,4)),
                  examineYear:date.getFullYear(),
                  month:date.getMonth()+1
                }
                that.isAttenRulesModal = true
              }
            }
          }, params.row.cityName+params.row.version)
        ])
      }
    }
    /*{
      title: '在线时长',
      key: 'onlineDuration',
      ellipsis: true,
      width: 180
    },
    {
      title: '高峰时长',
      key: 'peakDuration',
      ellipsis: true,
      width: 180
    },
    {
      title: '订单数',
      key: 'billNumber',
      ellipsis: true,
      width: 180
    }*/
  ]
}
export const detailTitle = [
  {
    title: '当日在线时长(分钟)',
    key: 'onlineDuration',
    ellipsis: true,
  },
  {
    title: '考勤日',
    key: 'statDay',
    ellipsis: true
  },
  {
    title: '日考勤',
    key: 'examineResult',
    ellipsis: true,
  },
  {
    title: '当日订单(单)',
    key: 'billNumber',
    ellipsis: true,
  },
  {
    title: '当日高峰时长(分钟)',
    key: 'peakDuration',
    ellipsis: true,
  },
  {
    title: '考勤结果',
    key: 'isAttendence',
    ellipsis: true,
    render:(h, params) =>{
      let isAttendances = ['未达标', '达标']
      return h('span', isAttendances[params.row.isAttendance])
    }
  }
]
export const monthPageData = {
  isAttenRulesModal: false,
  detailData: {},
  searchRule:{
    dayNumber:[{type: 'number', min: 0,max:30, message:'请输入大于0小于等于30的数字'}],
    dayEndNumber:[{type: 'number', min: 1,max:31, message:'请输入大于1小于小于等于31的数字'}],
  },
  isLoading: false,
  detailLoading: false,
  isHasAuthExport: true,
  isShowMore:false,
  isShowModal: false,
  queryAjaxPramas: {},
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableData: [],
}

export const inputList = [
  {
    name: 'cascader-input', // 文本输入框名
    bind_key: ['provinceId', 'cityId'], // 返回数据的key名
    placeholder: '请选择省/市',
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: '省 / 市：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '666', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false, // false: 不隐藏 / true: 隐藏
    changeOnSelect: true
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'agent', // 返回数据的key名
    placeholder: '请输入运营商名',
    value: '', // 用于数据绑定
    title: '运营商：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'driver', // 返回数据的key名
    placeholder: '请输入司机姓名',
    value: '', // 用于数据绑定
    title: '司机姓名：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'mobile', // 返回数据的key名
    placeholder: '请输入手机号',
    value: '', // 用于数据绑定
    title: '手机号：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'month-input', // 文本输入框名
    bind_key: 'statDay', // 返回数据的key名
    placeholder: '请选择考勤月份',
    clearable: false,
    value: '', // 用于数据绑定
    title: '考勤月份：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    options: {},//不可选日期
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'drop-input', // 文本输入框名
    bind_key: 'examineResult', // 返回数据的key名
    placeholder: '请选择考勤结果',
    value: '', // 用于数据绑定
    title: '考勤结果：', // 展示的字段名
    dropList: [
      {
          label: '未达标',
          value: 0
      },
      {
          label: '达标',
          value: 1
      }
    ],
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
  {
    name: 'text-input', // 文本输入框名
    bind_key: 'driverNo', // 返回数据的key名
    placeholder: '请输入司机编号',
    value: '', // 用于数据绑定
    title: '司机编号：', // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  },
]