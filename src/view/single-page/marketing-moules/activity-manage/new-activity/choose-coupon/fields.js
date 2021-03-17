import { mustTwo,validNowTime, validTime, numValidate, integerValidate, fourValid } from '../../validate'
let optionsTime = {
  disabledDate(date) {
    return date && date.valueOf() < Date.now() - 86400000;
  }
}
let ruleValidate = {
  // 推荐乘客奖励，奖励方式
  couponRewardType: [
    { required: true, type:'number', message: "必填", trigger: "blur" }
  ],
  // 阶梯奖励
  ladder: [
    { required: true, type: "array", min:1, message: "必填 ", trigger: "blur" },
    {trigger: "blur", validator: mustTwo}
  ],
  perRewardNum: [
    { required: true, type: "number", message: "必填 ", trigger: "blur" },
    { trigger: "change", validator: numValidate }
  ], //每次奖励券张
  totalRewardAmount: [
    { required: true, type: "number", message: "必填", trigger: "blur" },
    { trigger: "change", validator: integerValidate }
  ], //发放总额度(元)
  validityType: [{ required: true, type: "number", message: "必填", trigger: "blur" }], // 券有效期
  electronicCrawlName: [{ required: true, message: "必填", trigger: "blur" }], // 电子围栏名称
  startLimitTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }], // 限定期限开始时间
  endLimitTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }], // 限定期限结束时间
  guding: [
    {
      required: true,
      type: "array",
      min: 1,
      message: "必填",
      trigger: "blur"
    },
    { trigger: "change", validator: validNowTime }
  ], // 固定有效期：
  effectiveDays: [
    { required: true, type: "number", message: "必填", trigger: "blur" },
    { trigger: "change", validator: fourValid }
  ], // 动态有效期
  useCityArray: [
    {
      required: true,
      type: "array",
      min: 1,
      message: "必填",
      trigger: "blur"
    }
  ], // 城市
  timeSlot: [
    {
      required: true,
      type: "array",
      min: 1,
      message: "必填",
      trigger: "blur"
    },
    { trigger: "change", validator: validTime }
  ] // 使用时限
}
export const cacheData1 = {
  optionsTime,
  ruleValidate

}
export const cacheData2 = {
  optionsTime,
  ruleValidate
}
export const cacheData3 = {
  optionsTime,
  ruleValidate
}