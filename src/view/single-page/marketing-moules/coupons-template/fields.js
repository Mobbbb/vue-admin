 /** 类型 */
const couponTypeMap = {
  1: '折扣券',
  2: '抵扣券'
}

 /** 业务类型 */
 const useTypeMap = {
  1: '出租车',
  2: '专车',
  4: '快车'
}

 /** 业务限制 */
const useLimitMap = {
  1: '实时',
  2: '预约'
}

/** 使用方 */
const platformTypeMap = {
  1: '普通',
  2: '客服'
}

/** 优惠券模板状态 */
const couponTempleteMap = {
  1: '可用',
  2: '已停用'
}

export const fields = { // 优惠券模板
  index: {
    title: '序号',
    key: 'index',
    width: 70,
    fixed: 'left',
    render: (h, params) => {
      return h('div', params.index + 1)
    }
  },
  templateName: {
    title: '优惠券模板名称',
    key: 'templateName',
    tooltip: true,
    minWidth: 150,
    fixed: 'left'
  },
  couponType: {
    title: '类型',
    key: 'couponType',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: couponTypeMap[params.row.couponType]
        }
      })
    }
  },
  astrict: {
    title: '使用条件',
    key: 'astrict',
    tooltip: true,
    minWidth: 120,
    render: (h, params)=>{
      let text = '满' + params.row.astrict + '元使用'
      if(params.row.couponType === 1){
        text = '最高抵扣' + params.row.highestMoney + '元'
      }
      return h('span',text)
    }
  },
  useType: {
    title: '业务类型',
    key: 'useType',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: useTypeMap[params.row.useType]
        }
      })
    }
  },   
  useLimit: {
    title: '业务限制',
    key: 'useLimit',
    tooltip: true,
    minWidth: 100,
    render: (h, params) =>{
      return h('span', {
        domProps: {
          textContent: useLimitMap[params.row.useLimit]
        }
      })
    }
  },
  platformType: {
    title: '使用方',
    key: 'platformType',
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h('div', {
        domProps: {
          textContent: platformTypeMap[params.row.platformType]
        }
      })
    }
  },
  couponState: {
    title: '状态',
    key: 'couponState',
    tooltip: true,
    minWidth: 100,
    render: (h, params) => {
      return h('div', {
        domProps: {
          textContent: couponTempleteMap[params.row.couponState]
        }
      })
    }
  },
  createName: {
    title: '添加人',
    key: 'createName',
    tooltip: true,
    minWidth: 100
  },
  createdOn: {
    title: '添加时间',
    key: 'createdOn',
    tooltip: true,
    minWidth: 180
  }
};

export const oneOffCoupon = {  // 一次性发券记录
  couponMoney: {
    title: '优惠券',
    key: 'couponMsg',
    tooltip: true,
    minWidth: 150
  },
  createTime: {
    title: '添加时间',
    key: 'createTime',
    tooltip: true,
    minWidth: 180
  },
  createName: {
    title: '添加人',
    key: 'createName',
    tooltip: true,
    minWidth: 150
  },
}

export const pageData = {
  isLoading: false,
  isShowAudit: false,
  total: 0,
  current: 1,
  pageSize: 10,
  customList: {...fields},
  pageSizeOpts: [15, 30, 50, 100],
  tableColumns: [],
  tableColumnsChecked: Object.keys(fields),
  sidx: 'csmId',
  sord: 'desc',
  tableData: [],
  searchData: {},  
  formInline: {},
  formRule: {
    templateName: [
      {required: true, message: '必填', trigger: 'blur'}
    ],
    platformType: [
      {required: true, type: 'number', message: '必填', trigger: 'blur'}
    ],
    couponType: [
      {required: true, type: 'number', message: '必填', trigger: 'blur'}
    ],
    useType: [
      {required: true, type: 'number', message: '必填', trigger: 'blur'}
    ],
    useLimit: [
      {required: true, type: 'number', message: '请输入数字', trigger: 'blur'}
    ],
    discount: [
      {required: true, type: 'number', message: '请输入数字'},
      {min: 0.01, type: 'number', message: '最小不得小于0'},
      {max: 9.99, type: 'number', message: '最大不得大于10'}
    ],
    highestMoney: [
      {required: true, type: 'number', message: '请输入数字', trigger: 'blur'},
      {min: 0.01, type: 'number', message: '最小不得小于0'},
    ],
    couponMoney: [
      {required: true, type: 'number', message: '请输入数字', trigger: 'blur'},
      {min: 0.01, type: 'number', message: '请输入不小于0的数字'}
    ],
    astrict: [
      {required: true, type: 'number', message: '请输入数字', trigger: 'blur'},
      {min: 0, type: 'number', message: '请输入不小于0的数字'}
    ],
    couponState: [
      {required: true, type: 'number', message: '必填', trigger: 'blur'}
    ]
  },
  couponTypeMap: couponTypeMap,
  platformTypeMap: platformTypeMap,
  useTypeMap: useTypeMap,
  useLimitMap: useLimitMap,
  couponTempleteMap: couponTempleteMap
}

export const inputList = [
  {
    name: 'text-input',
    bind_key: 'templateName',
    placeholder: '请填写',
    value: '',
    titleWidth: 70,
    title: '模板名称：',
    inputWidth: 250,
    unicode: '2',
    isHide: false
  },
  {
    name: 'drop-input',
    bind_key: 'couponType',
    placeholder: '请选择',
    value: '',
    dropList: [
      {
        value: '1',
        label: '折扣券'
      },
      {
        value: '2',
        label: '抵扣券'
      }
    ],
    title: '优惠券类型：',
    inputWidth: 250,
    titleWidth: 75,
    unicode: '1',
    isHide: false
  },
  {
    name: 'drop-input',
    bind_key: 'platformType',
    placeholder: '请选择',
    value: '',
    dropList: [
      {
        value: '1',
        label: '普通'
      },
      {
        value: '2',
        label: '客服'
      }
    ],
    title: '使用方：',
    inputWidth: 250,
    titleWidth: 60,
    unicode: '1',
    isHide: false
  }
]
