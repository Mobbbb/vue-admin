/* 注册记录 */
export const registration = {
  mobile: {
    title: '乘客手机号',
    key: 'mobile',
    ellipsis: true,
    minWidth:100
  },
  realName: {
    title: '乘客姓名',
    key: 'realName',
    ellipsis: true,
    minWidth:100
  },
  rewardSum: {
    title: '注册奖励',
    key: 'result',
    ellipsis: true,
    tooltip: true,
    minWidth:140
  },
  activityName: {
    title: '活动名称',
    key: 'activityName',
    ellipsis: true,
    minWidth:100
  },
  createTime: {
    title: '注册时间',
    key: 'createTime',
    ellipsis: true,
    minWidth:140
  }
};

/* 邀请记录 */
export const invite = {
  referrerRole: {
    title: '推荐人角色',
    key: 'referrerRole',
    ellipsis: true,
    minWidth:100
  },
  pRealName: {
    title: '推荐人姓名',
    key: 'pRealName',
    ellipsis: true,
    minWidth:120
  },
  pMobile: {
    title: '推荐人手机号',
    key: 'pMobile',
    ellipsis: true,
    minWidth:130
  },  
  activityName: {
    title: '活动名称',
    key: 'activityName',
    ellipsis: true,
    tooltip: true,
    minWidth:120
  },
  recommendedDriverName: {
    title: '乘客姓名',
    key: 'recommendedDriverName',
    ellipsis: true,
    minWidth:120
  },
  recommendedDriverPhone: {
    title: '乘客手机号',
    key: 'recommendedDriverPhone',
    ellipsis: true,
    minWidth:130
  },
  firstTime: {
    title: '注册时间',
    key: 'firstTime',
    ellipsis: true,
    minWidth: 150
  },
  registerRewardSum: {
    title: '注册奖励',
    key: 'registerRewardSum',
    ellipsis: true,
    tooltip: true,
    minWidth: 150
  },
  createTime: {
    title: '完成首单时间',
    key: 'createTime',
    ellipsis: true,
    minWidth: 150
  },
  firstOrderSum: {
    title: '完成首单奖励',
    key: 'firstOrderSum',
    ellipsis: true,
    tooltip: true,
    minWidth: 150
  }
}
// 充值记录
export const recharge = {
  nickname: {
    title: '乘客昵称',
    key: 'nickname',
    ellipsis: true,
  },
  mobile: {
    title: '乘客手机号',
    key: 'mobile',
    ellipsis: true,
  },
  realName: {
    title: '乘客姓名',
    key: 'realName',
    ellipsis: true,
  },
  rechargeAmount: {
    title: '充值金额',
    key: 'rechargeAmount',
    ellipsis: true,
  },
  giftmoney: {
    title: '赠送',
    key: 'giftmoney',
    ellipsis: true,
  },
  activityName: {
    title: '活动名称',
    key: 'activityName',
    ellipsis: true,
  },
  createdOn: {
    title: '充值时间',
    key: 'createdOn',
    ellipsis: true,
  },
}

export const defaultData = {
  searchData: {},
  total: 0,
  isLoading: false,
  pageSizeOpts: [15, 30, 50, 100],
  current: 1,
  pageSize: 15,
  tableData: [],
  tableColumns: [],
  tableColumnsChecked: [],
  activityStatusMap:{
    1: '未开始',
    2: '在线中',
    3: '已结束',
    4: '已关闭'
  }
}