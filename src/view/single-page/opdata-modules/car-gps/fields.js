// 搜索配置
let inputList = [
  {
    name: "text-input",
    bind_key: "vin",
    placeholder: "请输入VIN",
    value: "",
    title: "VIN：",
    titleWidth: 40,
    inputWidth: 180, // input框的宽度
    key: "6",
    isHide: false
  },
  {
    name: "date-time-input", // 文本输入框名
    bind_key: ['startTime','endTime'], // 返回数据的key名
    placeholder: "请选择时间范围",
    value: "", // 用于数据绑定
    title: "时间段：", // 展示的字段名
    titleWidth: 60, // 展示的字段名的宽度
    inputWidth: 300, // input框的宽度
    options: {},
    key: "6", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  }
]

export const cacheData = {
  inputList
}