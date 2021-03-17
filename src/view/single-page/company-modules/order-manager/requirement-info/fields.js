
/* 订单管理--需求单信息 */
export const returnFields = that => {
    return {
        sceneName: {
            title: '用车场景',
            key: 'sceneName',
            tooltip: true,
            minWidth: 100,
            align: 'center'
        },
        typeTime: {
            title: '订单类型',
            key: 'typeTime',
            tooltip: true,
            minWidth: 100,
            align: 'center',
            render (h, params) {
                let typeTimeMap = {
                    1: '实时',
                    2: '预约'
                }
                return h('div', typeTimeMap[params.row.typeTime])
            }
        },
        applyNo: {
            title: '申请单编号',
            key: 'applyNo',
            tooltip: true,
            minWidth: 180,
            align: 'center'
        },
        passengerPhone: {
            title: '下单人手机号',
            key: 'passengerPhone',
            tooltip: true,
            minWidth: 180,
            align: 'center'
        },
        passengerName: {
            title: '下单人姓名',
            key: 'passengerName',
            tooltip: true,
            minWidth: 160,
            align: 'center'
        },
        createTime: {
            title: '下单时间',
            key: 'createTime',
            tooltip: true,
            minWidth: 180,
            align: 'center'
        },
        companyName: {
            title: '企业名称',
            key: 'companyName',
            tooltip: true,
            minWidth: 100,
            align: 'center'
        },
        bussniseType: {
            title: '用车分类',
            key: 'bussniseType',
            tooltip: true,
            minWidth: 110,
            align: 'center',
            render (h, params) {
                let typeMap = {
                    2: '专车',
                    4: '快车'
                }
                let newArray = []
                let bussniseTypeList = params.row.bussniseTypeList || []
                bussniseTypeList.forEach(item => {
                    newArray.push(typeMap[item])
                });
                return h('div', newArray.join(',') || '暂无')
            }
        },
        status: {
            title: '申请单状态',
            key: 'status',
            tooltip: true,
            width: 150,
            align: 'center',
            render(h, params) {
                let statusMap = {
                    0: '待审批', 
                    1: '审批驳回', 
                    2: '超时未审批', 
                    3: '已完成', 
                    4: '取消', 
                    5: '派单中', 
                    6: '派单成功', 
                    7: '派单失败'
                }
                return h('div', statusMap[params.row.status])
            }
        },
        cost: {
            title: '申请单金额',
            key: 'cost',
            tooltip: true,
            width: 150,
            align: 'center'
        },
        action: {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
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
                        on: {
                            click: () => {
                                if (params.row.uuid) {
                                    that.$router.push({ name: 'demandorder-detail', params: { id: params.row.uuid } })
                                } else {
                                    that.$Message.warning('订单Uuid为空，查询不到该订单信息')
                                }
                            }
                        }
                    }, '详情')
                ]);
            }
        }
    }
};
export const inputList = [
    // {
    //     name: 'drop-input', // 文本输入框名
    //     bind_key: 'sceneId', // 返回数据的key名
    //     dropList: [
    //         {
    //             label: '加班用车',
    //             value: 0
    //         },
    //         {
    //             label: '出差用车',
    //             value: 1
    //         }
    //     ],
    //     placeholder: '用车场景选择',
    //     value: '', // 用于数据绑定
    //     title: '用车场景：', // 展示的字段名
    //     titleWidth: 75, // 展示的字段名的宽度
    //     key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    //     inputWidth: 200,
    //     isHide: false // false: 不隐藏 / true: 隐藏
    // },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'typeTime', // 返回数据的key名
        dropList: [
            {
                label: '实时',
                value: 1
            },
            {
                label: '预约',
                value: 2
            }
        ],
        placeholder: '订单类型选择',
        value: '', // 用于数据绑定
        title: '订单类型：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '2', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'applyNo', // 返回数据的key名
        placeholder: '请填写申请单编号',
        value: '', // 用于数据绑定
        title: '申请单编号：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '3', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'passengerPhone', // 返回数据的key名
        placeholder: '请填写下单手机号',
        value: '', // 用于数据绑定
        title: '下单手机号：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '4', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'passengerName', // 返回数据的key名
        placeholder: '请填写下单人姓名',
        value: '', // 用于数据绑定
        title: '下单人姓名：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '5', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'date-input',
        bind_key: ['createBeginTime','createEndTime'],
        placeholder: '请选择下单时间',
        value: '',
        title: '下单时间：',
        titleWidth: 75,
        inputWidth: 200,
        key: '6',
        isHide: false
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'companyName', // 返回数据的key名
        placeholder: '请输入企业名称',
        value: '', // 用于数据绑定
        title: '企业名称：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '7', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'bussniseType', // 返回数据的key名
        dropList: [
            {
                label: '专车',
                value: 2
            },
            {
                label: '快车',
                value: 4
            }
        ],
        placeholder: '用车分类选择',
        value: '', // 用于数据绑定
        title: '用车分类：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '8', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'status', // 返回数据的key名
        dropList: [
            {
                label: '待审批',
                value: 0
            },
            {
                label: '审批驳回',
                value: 1
            },
            // {
            //     label: ' 超时未审批',
            //     value: 2
            // },
            {
                label: ' 已完成',
                value: 3
            },
            {
                label: ' 取消',
                value: 4
            },
            {
                label: ' 派单中',
                value: 5
            },
            // {
            //     label: ' 派单成功',
            //     value: 6
            // },
            {
                label: ' 派单失败',
                value: 7
            }
        ],
        placeholder: '申请单状态选择',
        value: '', // 用于数据绑定
        title: '申请单状态', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '9', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    }
]
//订单主状态 
export const orderMainStatusMap = {
    0:'待审批',
    1:'审批驳回',
    2:'超时未审批',
    3:'已完成',
    4:'取消',
    5:'派单中',
    6:'派单成功',
    7:'派单失败'
}
// 订单来源
export const orderSourceMap = {
    1: "APP移动端",
    2: "微信公众号",
    3: "客服",
    4: "pc网站"
}
// 订单类型
export const payTypeMap = {
    1: "支付宝",
    2: "微信",
    3: "一网通",
    4: "余额",
    5: "优惠券",
    6: "线下支付"
}

export const drawBillMap = {
    0: '待开票',
    1: '已开票',
}

export const invoiceTypeMap = {
    1: '电子发票',
    2: '纸质发票'
}

export const cancelTypeMap = {
    0: '乘客无责取消', 
    1: '乘客政策免费取消',
    2: '乘客使用免费次数取消' ,
    3: '乘客付费取消',
    4: '超时自动取消',
    5: '客服关闭订单'
}
export const orderTypeMap = {
    1: '实时',
    2: '预约',
}
export const businessTypeMap = {
    0: '企业用车',
    2:'专车',
    4:'快车'
}
export const sourceMap = {
    1: 'APP移动端',2: '微信公众号',3: '客服', 4: 'pc网站'
}
/** 订单详情 */
export const titleMap = {
    basicInfo: '基本信息',
    contactorder: '关联订单',
    timeInfo: '时间信息',
    companyInfo: '企业用车信息',
    placeorderInfo: '下单人信息',
    costInfo: '费用信息',
    cancelInfo: '取消信息'
}
export const orderData = {
    basicInfo: [
        {
            name: "申请单状态",
            key: "status",
            span: '12',
            value: ''
        },
        {
            name: "申请单编号",
            key: "applyNo",
            span: '12',
            value: ''
        },
        {
            name: "业务类型",
            key: "businessType",
            span: '12',
            value: ''
        },
        {
            name: "订单类型",
            key: "typeTime",
            span: '12',
            value: ''
        },
        {
            name: "起点",
            key: "orgAddress",
            span: '12',
            value: ''
        },
        {
            name: "终点",
            key: "destAddress",
            span: '12',
            value: ''
        },
        {
            name: "是否代叫车",
            key: "typeSelf",
            span: '12',
            value: ''
        },
        {
            name: "订单来源",
            key: "source",
            span: '12',
            value: ''
        }
    ],
    contactorder: [
        // {
        //     name: "订单编号",
        //     key: "routePlanNo",
        //     span: '8',
        //     value: ''
        // },
        // {
        //     name: "用车分类",
        //     key: "businessType",
        //     span: '8',
        //     value: ''
        // },
        // {
        //     name: "订单费用",
        //     key: "estimatedPrice",
        //     span: '8',
        //     value: ''
        // }
    ],
    timeInfo: [
        {
            name: "下单时间",
            key: "createTime",
            span: '12',
            value: ''
        },
    ],
    companyInfo: [
        {
            name: "公司名称",
            key: "companyName",
            span: '12',
            value: ''
        },
        {
            name: "所属机构",
            key: "departName",
            span: '12',
            value: ''
        },
        {
            name: "用车数量",
            key: "businessCarNum",
            span: '12',
            value: ''
        },
        {
            name: "备注",
            key: "toDriverRemarks",
            span: '12',
            value: ''
        },
        {
            name: "用车场景",
            key: "sceneName",
            span: '12',
            value: ''
        },
        {
            name: "用车规则",
            key: "sceneRuleName",
            span: '12',
            value: ''
        }
    ],
    placeorderInfo: [
        {
            name: "下单人姓名",
            key: "passengerName",
            span: '12',
            value: ''
        },
        {
            name: "下单人手机号",
            key: "passengerPhone",
            span: '12',
            value: ''
        },
    ],
    costInfo: [
        {
            name: "预估费用",
            key: "cost",
            span: '12',
            value: '0',
            unit: '元'
        },
        {
            name: "实际费用",
            key: "payAmount",
            span: '12',
            value: '0',
            unit: '元'
        }
    ],
    cancelInfo: [
        {
            name: "取消时间",
            key: "cancelTime",
            span: '12',
            value: ''
        },
        {
            name: "取消类型",
            key: "cancelType",
            span: '12',
            value: ''
        }, // 0 乘客无责取消 1 乘客政策免费取消 2 乘客使用免费次数取消  3 乘客付费取消 4超时自动取消
        {
            name: "取消原因",
            key: "reason",
            span: '24',
            value: ''
        }
    ]
}
