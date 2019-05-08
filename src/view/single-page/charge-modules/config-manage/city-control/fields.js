import { axiosSwitchCity } from "@/api/charge.js";
// table数据
export const returnFields = (that) => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    cityName: {
      title: '城市',
      key: 'cityName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    brandName: {
      title: '品牌',
      key: 'brandName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    status: {
      title: '状态',
      key: 'status',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        switch (Number(params.row.status)) {
          case 0:
            return h('div', '已关闭')
          case 1:
            return h('div', '已开通')
          default:
            return false
        }
      }
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: Number(params.row.status) === 1 ? 'error' : 'success',
              ghost: true,
              size: "small"
            },
            directives: [{
              name: 'hasAuth',
              value: 'charge-city-control-switch'
            }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: Number(params.row.status) === 1 ? '确认停用此城市' : '确认启用此城市',
                  content: `<div>城市：${params.row.cityName}</div><div>品牌：${params.row.brandName}</div>`,
                  onOk: () => {
                    let param = {
                      uuid: params.row.uuid,
                      status: Number(params.row.status) === 1 ? 0 : 1
                    }
                    axiosSwitchCity(param).then(res => {
                      if (res.data.success) {
                        that.$Message.success(res.data.msg);
                        that.getList()
                      } else {
                        that.$Message.error(res.data.msg);
                      }
                    })
                  }
                })
              }
            }
          }, Number(params.row.status) === 1 ? '停用' : '启用')
        ])
      }
    }
  }
}
// 搜索列表数据
export const inputList = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "cityId", // 返回数据的key名
    placeholder: "请选择城市",
    value: '', // 绑定返回数据
    title: "城市：", // 展示的字段名
    dropList: [],
    titleWidth: 70, // 展示的字段名的宽度
    inputWidth: 160, // input框的宽度
    key: "6", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
    // filterable: true
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "supplierId", // 返回数据的key名
    placeholder: "请选择品牌",
    value: "", // 用于数据绑定
    title: "品牌：", // 展示的字段名
    dropList: [],
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    key: "1", // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
  }
] //搜索列表

// 表单校验
export const addCityParamsRule = {
  city: [
    {
      required: true,
      type: "array",
      min: 2,
      message: "城市不能为空",
      trigger: "change"
    }
  ], //城市
  supplierId: [
    { required: true, message: "品牌不能为空", trigger: "change" }
  ] //品牌
}
// 品牌列表
export const brandList = []
export const pageObj = {
  total: 0,
  current: 1,
  pageSize: 10
}
export const searchData = {}