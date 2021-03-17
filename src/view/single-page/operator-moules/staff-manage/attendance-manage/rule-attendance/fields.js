export const tableTitle = [
   {
    title: '所属城市',
    key: 'cityName',
    tooltip: true
  },
  {
    title: '运营商',
    key: 'agentName',
    tooltip: true
  },
  {
    title: '创建时间',
    key: 'createTime',
    tooltip: true
  },
  {
    title: '修改时间',
    key: 'updateTime',
    tooltip: true
  }
]
export const rulePageData = {
  month: '',
  year: '',
  checkYear: '',
  isEdit: false,
  isReadonly: false,
  ruleModalTitle: '新增规则',
  isShowRuleModal: false,
  isLoading: false,
  isHasAuthExport: true,
  isShowMore:false,
  isShowDayCard: true,
  searchData: {},
  queryAjaxPramas: {},
  allMonths: [
    {value: '1', text: '1月'},
    {value: '2', text: '2月'},
    {value: '3', text: '3月'},
    {value: '4', text: '4月'},
    {value: '5', text: '5月'},
    {value: '6', text: '6月'},
    {value: '7', text: '7月'},
    {value: '8', text: '8月'},
    {value: '9', text: '9月'},
    {value: '10', text: '10月'},
    {value: '11', text: '11月'},
    {value: '12', text: '12月'}
  ],
  commonFormData: {
    list: [{month: null, day: null}]
  },
  checkRule: {
    onlineDuration:[{required: true, message: '请填写日在线时间'}],
    heightDuration:[{required: true, message: '请填写日高峰时间'}],
    examineYear:[{required: true, message: '请填写年份'}],
    month:[{type: 'number', required: true, message: '请填写月份'}],
    day:[{type: 'number',required: true, message: '请填写出勤天数'}],
    cityUuids: [{type: 'array',required: true, message: '请填写城市'}],
    agentUuids: [{type: 'array',required: true, message: '请填写运营商'}],
  },
  checkTypes: [
    {
      text: '日考勤',
      value: 'D'
    },
    {
      text: '月考勤',
      value: 'M'
    }
  ],
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [15, 30, 50, 100],
  tableColumns: [],
  tableData: []
}