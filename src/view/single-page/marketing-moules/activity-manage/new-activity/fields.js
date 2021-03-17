import { moreThanCurrentTime,mustAward,validNowTime, validTime,noEmpty, integerValidate } from '../validate'
export const userGroupColumns = (that)=>{
  return [
    {
      title: '用户群名称',
      key: 'userGroupName'
    },
    {
      title: '用户群编码',
      key: 'userGroupCode'
    },
    {
      title: '用户群类型',
      key: 'userGroupType',
      render: (h, params) => {
        return h('div', params.row.userGroupType===1?'导入类':'条件类')
      }
    },
    {
      title: '用户群人数',
      key: 'userGroupCount'
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: 'text',
              size: 'small'
            },
            style:{
              color:'#57a3f3'
            },
            on: {
              click: () => {
                that.ruleData.selectUserGroup.splice(params.index,1)
              }
            }
          }, '删除'),
        ]);
      }
    }
  ]//用户群标题
}
export const awardTypeLabel1 = {
  onlyStart:'每推荐成功注册',
  onlyMiddle:'名乘客，奖励',
  onlyEnd:'张',
  tableFirst:'成功推荐用户注册人数',
  tableSecond:'优惠券奖励总张数'
}
export const awardTypeLabel2 = {
  onlyStart:'每',
  onlyMiddle:'名新用户完成首单，奖励',
  onlyEnd:'张',
  tableFirst:'成功完成首单新用户数',
  tableSecond:'优惠券奖励总张数'
}
export const awardTypeLabel3 = {
  onlyStart:'每加入助力团',
  onlyMiddle:'名新用户，奖励',
  onlyEnd:'次',
  tableFirst:'成功加入助力团新用户数',
  tableSecond:'优惠券奖励总次数',
}
export const cacheData = {
  cityList: [],//城市列表
  infoDataRules: {
    activityName: [
      { required: true, message: '请输入活动名称', trigger: 'blur' }
    ],
    activityType: [
      { required: true,  message: '请选择活动类型', trigger: 'change' }
    ]
  },
  ruleDataRules: {
    cityArray: [
      { required: true, type: 'array', min: 1,  message: '请选择城市', trigger: 'blur' }
    ],
    businessTypeList: [
      { required: true, type: 'array', min: 1,  message: '请选择业务线', trigger: 'blur' }
    ],
    userLimitList: [
      { required: true, type: 'array', min: 1,  message: '请选择订单类型', trigger: 'blur' }
    ],
    selectUserGroup: [
      { required: true, type: 'array', min: 1,  message: '请选择用户群', trigger: 'blur' }
    ],
    psword: [
      { required: true, message: '领取口令不可为空', trigger: 'blur' }
    ],
    isGrantImmediately: [
      { required: true, type:'number', message: '请选择发放时间', trigger: 'blur' }
    ],
    pushContent: [
      { required: true, message: '通知内容不可为空', trigger: 'blur' }
    ],
    needUserGroup: [
      { required: true, type: 'number', message: '请选择用户群', trigger: 'blur' }
    ],
    startGrantTime: [
      { required: true, message: '请选择发放开始时间', trigger: 'blur' },
      { trigger: 'change', validator: moreThanCurrentTime },
    ],
    time:[
      { required: true, trigger: 'change', validator: validTime },
      { trigger: 'change', validator: validNowTime },
    ],
    activityQuotaType: [
      { required: true, type:'number', message: '请选择额度', trigger: 'blur' }
    ],
    activityTotal: [
      { required: true, type:'number', message: '请输入总额度', trigger: 'blur' },
      { trigger: 'change', validator: integerValidate }
    ],
    completionDeadline: [
      { required: true, type:'number', message: '请输入助力达成期限', trigger: 'blur' },
      { trigger: 'change', validator: integerValidate }
    ],
    maxRewardCount: [
      { required: true, type:'number', message: '请输入上限', trigger: 'blur' },
      { trigger: 'change', validator: integerValidate }
    ],
    maxDayRewardCount: [
      { required: true, type:'number', message: '请输入上限', trigger: 'blur' },
      { trigger: 'change', validator: integerValidate }
    ],
    routemaxRewardCount: [
      { required: true, type:'number', message: '请输入上限', trigger: 'blur' },
      { trigger: 'change', validator: integerValidate }
    ],
    ladder: [
      { required: true, type: 'array', min: 1, message: '请填写奖励规则', trigger: 'blur' },
      { trigger: 'blur', validator: mustAward }
    ],
    template: [
      { required: true, type: 'array', min: 1, message: '请选择优惠券模板', trigger: 'blur' },
      { trigger: 'change', validator: noEmpty }
    ]
  },
  landPageDataRules: {
    shareTitle: [
      { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    beforeLandingPageRule: [
      { required: true, message: '请输入活动规则', trigger: 'blur' }
    ],
    beforeLandingPageTitle: [
      { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    afterLandingPageTitle: [
      { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    shareSubTitle: [
      { required: true, message: '请输入副标题', trigger: 'blur' }
    ],
    shareFriendsTitle:[
      { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    shareIcon:[
      { required: true, message: '请添加分享图标', trigger: 'blur' }
    ],
    shareFriendsIcon:[
      { required: true, message: '请添加分享图标', trigger: 'blur' }
    ]
  },
  awardTypeLabel1,
  awardTypeLabel2,
  awardTypeLabel3
}