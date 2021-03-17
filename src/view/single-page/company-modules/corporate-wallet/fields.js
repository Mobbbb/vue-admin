import { timeFormat } from "@/libs/util.js";

/* 派车管理列表 */
export const returnFields = that => {
    return {
        companyName: {
            title: '企业名称',
            key: 'companyName',
            tooltip: true,
            minWidth: 220,
            align: 'center'
        },
        cash: {
            title: '现金余额',
            key: 'cash',
            tooltip: true,
            minWidth: 100,
            align: 'center'
        },
        creditLine: {
            title: '授信额度',
            key: 'creditLine',
            tooltip: true,
            minWidth: 100,
            align: 'center'
        },
        availableCredit: {
            title: '可用额度',
            key: 'availableCredit',
            tooltip: true,
            minWidth: 180,
            align: 'center'
        },
        contactName: {
            title: '企业联系人',
            key: 'contactName',
            tooltip: true,
            minWidth: 80,
            align: 'center'
        },
        contactInfo: {
            title: '联系方式',
            key: 'contactInfo',
            tooltip: true,
            minWidth: 80,
            align: 'center'
        },
        status: {
            title: '状态',
            key: 'status',
            tooltip: true,
            minWidth: 60,
            align: 'center',
            render: (h, params) => {
                let status = params.row.status;
                let statusarr = {
                    1: '正常',
                    2: '冻结',
                }
                return h('div', statusarr[status])
            }
        },
        action: {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 520,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'success',
                            size: 'small'
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'customer-basic-detail'
                        }],
                        attrs: {
                            ghost: 'ghost'
                        },
                        style: {
                            margin: '0 10px',
                            float: 'left'
                        },
                        on: {
                            click: () => {
                                let id = params.row.companyId
                                if (!id) {
                                    that.$Message.warning('企业ID为空')
                                    return false
                                }
                                that.$router.push({
                                    path: `/corporateWallet/creditgranting/${id}`
                                })
                            }
                        }
                    }, '授信管理'),
                    h('Button', {
                        props: {
                            type: 'success',
                            size: 'small'
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'customer-basic-detail'
                        }],
                        attrs: {
                            ghost: 'ghost'
                        },
                        style: {
                            margin: '0 10px',
                            float: 'left'
                        },
                        on: {
                            click: () => {
                                let id = params.row.companyId
                                if (!id) {
                                    that.$Message.warning('企业ID为空')
                                    return false
                                }
                                that.$router.push({
                                    path: `/corporateWallet/walletGrant/${id}`
                                })
                            }
                        }
                    }, '赠款管理'),
                    h('Button', {
                        props: {
                            type: 'success',
                            size: 'small'
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'customer-basic-detail'
                        }],
                        attrs: {
                            ghost: 'ghost'
                        },
                        style: {
                            margin: '0 10px',
                            float: 'left',
                            width: '64px',
                            display: params.row.status == 1? 'inline-block': 'none'
                        },
                        on: {
                            click: () => {
                                that.companyId = params.row.companyId
                                that.freezOptaion = true
                            }
                        }
                    }, '冻结'),
                    h('Button', {
                        props: {
                            type: 'success',
                            size: 'small'
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'customer-basic-detail'
                        }],
                        attrs: {
                            ghost: 'ghost'
                        },
                        style: {
                            margin: '0 10px',
                            float: 'left'
                        },
                        on: {
                            click: () => {
                                let id = params.row.companyId
                                if (!id) {
                                    that.$Message.warning('企业ID为空')
                                    return false
                                }
                                that.$router.push({
                                    path: `/corporateWallet/walletRefund/${id}`
                                })
                            }
                        }
                    }, '退款试算'),
                    h('Button', {
                        props: {
                            type: 'success',
                            size: 'small'
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'customer-basic-detail'
                        }],
                        attrs: {
                            ghost: 'ghost'
                        },
                        style: {
                            margin: '0 10px',
                            float: 'left'
                        },
                        on: {
                            click: () => {
                                let id = params.row.companyId
                                if (!id) {
                                    that.$Message.warning('企业ID为空')
                                    return false
                                }
                                that.$router.push({
                                    path: `/corporateWallet/walletRecharge/${id}`
                                })
                            }
                        }
                    }, '充值记录')
                ]);
            }
        }
    }
};
export const inputList = [
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'companyName', // 返回数据的key名
        placeholder: '请输入企业名称',
        value: '', // 用于数据绑定
        title: '企业名称：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '3', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    }
]
export const returnFieldstitle = (that) => {
    return {
        applicationNo: {
            title: '申请单号',
            key: 'applicationNo',
            ellipsis: true,
            tooltip: true,
            align: 'center',
            width: 200
        },
        reason: {
            title: '事由',
            key: 'reason',
            ellipsis: true,
            tooltip: true,
            align: 'center',
            minWidth: 270
        },
        amount: {
            title: '金额',
            key: 'amount',
            ellipsis: true,
            tooltip: true,
            align: 'center',
            minWidth: 120
        },
        applicant: {
            title: '申请人',
            key: 'applicant',
            ellipsis: true,
            tooltip: true,
            align: 'center',
            minWidth: 120
        },
        status: {
            title: '状态',
            key: 'status',
            ellipsis: true,
            tooltip: true,
            minWidth: 190,
            align: 'center',
            render: (h, params) => {
                let statusMap = {
                    0: '待审核',
                    1: '已通过',
                    2: '已驳回'
                }
                return h('div', statusMap[params.row.status])
            }
        },
        time: {
            title: '时间',
            key: 'time',
            ellipsis: true,
            tooltip: true,
            align: 'center',
            minWidth: 220
        },
        action: {
            title: '下载文件',
            key: 'action',
            fixed: 'right',
            width: 140,
            align: 'center',
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: "info",
                            ghost: true,
                            size: "small"
                        },
                        on: {
                            click: () => {
                            }
                        }
                    }, '相关文件')
                ])
            }
        }
    }
}
export const returnFieldsrecharge = (that) => {
  return {
    applicationNo: {
      title: '公司名称',
      key: 'companyName',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      width: 200
    },
    reason: {
      title: '充值时间',
      key: 'rechargeTime',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      minWidth: 270,
      render: (h, params) => {
        return h('div', timeFormat(params.row.rechargeTime,'yyyy-mm-dd'))
      }
    },
    payChannel: {
      title: '充值方式',
      key: 'payChannel',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      minWidth: 120,
      render: (h, params) => {
        let payChannel = {
          1: '支付宝',
          2: '微信',
          3: '一网通',
          4: '余额',
          5: '优惠券',
          6: '线下支付',
          7: '营销或者客服操作',
          8: '银联支付',
          9: '企业账户支付',
          10: '支付宝PC支付',
          11: '银联B2B',
          12: '企业线下支付',
          13: '行程预付款',
        }
        return h('div', payChannel[params.row.payChannel])
      }
    },
    rechargeAmount: {
      title: '充值金额',
      key: 'rechargeAmount',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      minWidth: 120
    },
    rechagerName: {
      title: '充值人',
      key: 'rechagerName',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      minWidth: 120
    },
    status: {
      title: '充值状态',
      key: 'status',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      minWidth: 120,
      render: (h, params) => {
        let status = {
          1: '充值中',
          2: '成功',
          3: '失败'
        }
        return h('div', status[params.row.status])
      }
    },
    // status: {
    //     title: '状态',
    //     key: 'status',
    //     ellipsis: true,
    //     tooltip: true,
    //     minWidth: 190,
    //     align: 'center',
    //     render: (h, params) => {
    //         let statusMap = {
    //             0: '待审核',
    //             1: '已通过',
    //             2: '已驳回'
    //         }
    //         return h('div', statusMap[params.row.status])
    //     }
    // },
  }
}
export const rechargeinputList = [
    // {
    //     name: 'text-input', // 文本输入框名
    //     bind_key: 'companyName', // 返回数据的key名
    //     placeholder: '请输入公司名称',
    //     value: '', // 用于数据绑定
    //     title: '公司名称', // 展示的字段名
    //     titleWidth: 60, // 展示的字段名的宽度
    //     inputWidth: 200, // input框的宽度
    //     key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    //     isHide: false // false: 不隐藏 / true: 隐藏
    // },
    {
        name: 'date-time-input',
        bind_key: ['startTime' ,'endTime'],
        placeholder: '请选择充值时间',
        value: '',
        title: '充值时间',
        titleWidth: 60,
        inputWidth:200,
        unicode: '2',
        isHide: false
      },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'payChannel', // 返回数据的key名
        placeholder: '请选择充值方式',
        value: '', // 绑定返回数据
        dropList: [
            {
                label: '支付宝',
                value: 1
            },
            {
                label: '微信',
                value: 2
            },
            {
                label: '一网通',
                value: 3
            },
            {
                label: '余额',
                value: 4
            },
            {
                label: '优惠券',
                value: 5
            },
            {
                label: '线下支付',
                value: 6
            },
            {
                label: '营销或者客服操作',
                value: 7
            },
          {
            label: '银联支付',
            value: 8
          },
          {
            label: '企业账户支付',
            value: 9
          },
          {
            label: '支付宝PC支付',
            value: 10
          },
          {
            label: '银联B2B',
            value: 11
          },
          {
            label: '企业线下支付',
            value: 12
          },
          {
            label: '行程预付款',
            value: 13
          },

        ], // 级联列表
        title: '充值方式', // 展示的字段名
        titleWidth: 60, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: '3', // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false // false: 不隐藏 / true: 隐藏
    },

    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'status', // 返回数据的key名
        placeholder: '请选择充值状态',
        value: '', // 绑定返回数据
        dropList: [
            {
                label: '充值中',
                value: 1
            },
            {
                label: '成功',
                value: 2
            },
            {
                label: '失败',
                value: 3
            }
        ], // 级联列表
        title: '充值状态', // 展示的字段名
        titleWidth: 60, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: '4', // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false // false: 不隐藏 / true: 隐藏
    }
]
