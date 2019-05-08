/** 优惠券 */
export const fields = {
  couponName: {
    title: '优惠券名称',
    key: 'couponName',
    ellipsis: true,
    tooltip: true,
    width: 150,
  },
  listCity: {
    title: '针对城市',
    key: 'listCityText',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  templateName: {
    title: '优惠券模板',
    key: 'templateName',
    ellipsis: true,
    tooltip: true,
    width: 150,
  },
  periodBeginEnd: {
    title: '使用时段',
    key: 'periodBeginEnd',
    ellipsis: true,
    width: 120
  },   
  expiryDay: {
    title: '有效期',
    key: 'expiryDay',
    ellipsis: true,
    width: 100
  },
  createName: {
    title: '操作人',
    key: 'createName',
    ellipsis: true,
    width: 100
  },
  createdOn: {
    title: '操作时间',
    key: 'createdOn',
    ellipsis: true,
    width: 180
  },
};
export const pageData = {
  isLoading: false,
  isShowAudit: false,
  total: 0,
  current: 1,
  pageSize: 15,
  customList: {...fields},
  pageSizeOpts: [15, 30, 50, 100],
  tableColumns: [],
  tableColumnsChecked: ['couponName', 'listCity', 'templateName', 'periodBeginEnd', 'expiryDay', 'createName', 'createdOn'],
  sidx: 'csmId',
  sord: 'desc',
  tableData: [],
  searchData: {},
  formInline: {},
  templateName: [], // 优惠券模板名字
  timeArr: [...new Array(25).keys()].join().split(','),
  checkAll: false, // 是否全选
  checkAllGroup: [],
  citys: [], // 全部已开通城市
  indeterminate: false, // 控制多选样式
  formRule: {
    couponName: [
      {required: true, message: '必填', trigger: 'blur'}
    ],
    templateUuid: [
      {required: true, message: '必填', trigger: 'blur'}
    ],
    periodBegin: [
      {required: true, message: '必填', trigger: 'blur'}
    ],
    cityUuid: [
      {required: true, message: '必填', trigger: 'blur'}
    ],
    expiryDay: [
      {required: true, type: 'number', message: '必填', trigger: 'blur'},
      {type: 'number', message: '请输入数字'},
      {min: 0.01, type: 'number', message: '有效期不能小于0.01天'},
      {max: 90, type: 'number', message: '有效期不能超过90天'},
    ],
    totalNumber: [
      {required: true, type: 'number', message: '必填', trigger: 'blur'},
      {type: 'number', message: '请输入数字'}
    ]
  }
}