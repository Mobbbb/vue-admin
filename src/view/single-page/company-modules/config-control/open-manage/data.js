export const pagedata = {
    discountCityId: "",
    inputList: [
      {
        name: "cascader-input", // 文本输入框名
        bind_key: ["provinceID", "cityID"], // 返回数据的key名
        placeholder: "请选择省/市",
        value: [], // 绑定返回数据
        cascaderList: [], // 级联列表
        title: "省 / 市：", // 展示的字段名
        titleWidth: 60, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: "2", // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false, // false: 不隐藏 / true: 隐藏
        changeOnSelect: true
      }
    ],
    unScitylist: "",
    selectedCitys: [],
    popDiscount: false, // 弹出折扣矩阵
    addModal: false,
    addCityForm: {},
    papaData: {},
    chinalist: {},
    selectedCityUuid: "",
    selectedCity: "",
    cityData: [],
    totalCount: "",
    pageSize: 10,
    current: 1,
    total: null
}