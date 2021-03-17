import { awardTypeLabel1, awardTypeLabel2, awardTypeLabel3 } from '../new-activity/fields'
let ladder1Columns = [
  {
    title: awardTypeLabel1.tableFirst,
    key: "ladderValue"
  },
  {
    title: awardTypeLabel1.tableSecond,
    key: "rewardValue"
  }
]
let ladder2Columns = [
  {
    title: awardTypeLabel2.tableFirst,
    key: "ladderValue"
  },
  {
    title: awardTypeLabel2.tableSecond,
    key: "rewardValue"
  }
]
export const cacheData = {
  infoData: {}, //基本信息
  ruleData: {}, //规则信息
  setData: {}, //配置信息
  userGroupColumns: [
    {
      title: "用户群名称",
      key: "userGroupName"
    },
    {
      title: "用户群编码",
      key: "userGroupCode"
    },
    {
      title: "用户群类型",
      key: "userGroupType"
    },
    {
      title: "用户群人数",
      key: "userGroupCount"
    }
  ],
  awardColumns: [
    {
      title: "充值金额",
      key: "ladderValue"
    },
    {
      title: "奖励类型",
      key: "type"
    },
    {
      title: "奖励金额(元)",
      key: "rewardValue"
    }
  ],
  ladderColumns: [
    {
      title: "成功加入助力团新用户数",
      key: "ladderValue"
    },
    {
      title: "优惠券奖励总次数",
      key: "rewardValue"
    }
  ],
  awardTypeLabel1: {...awardTypeLabel1,ladderColumns:ladder1Columns},
  awardTypeLabel2: {...awardTypeLabel2,ladderColumns:ladder2Columns},
}