
/* 派车管理列表 */
export const returnFields = that => {
    return {
        // sceneName: {
        //     title: '用车场景',
        //     key: 'sceneName',
        //     tooltip: true,
        //     minWidth: 100,
        //     align: 'center'
        // },
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
        routePlanNo: {
            title: '订单编号',
            key: 'routePlanNo',
            tooltip: true,
            minWidth: 150,
            align: 'center'
        },
        createTime: {
            title: '下单时间',
            key: 'createTime',
            tooltip: true,
            minWidth: 180,
            align: 'center'
        },
        orgAddress: {
            title: '出发地',
            key: 'orgAddress',
            tooltip: true,
            minWidth: 80,
            align: 'center'
        },
        destAddress: {
            title: '目的地',
            key: 'destAddress',
            tooltip: true,
            minWidth: 80,
            align: 'center'
        },
        companyName: {
            title: '企业名称',
            key: 'companyName',
            tooltip: true,
            minWidth: 100,
            align: 'center'
        },
        businessType: {
            title: '用车分类',
            key: 'businessType',
            tooltip: true,
            minWidth: 110,
            align: 'center',
            render (h, params) {
                let businessTypeMap = {
                    4: '快车',
                    2: '专车'
                }
                return h('div', businessTypeMap[params.row.businessType])
            }
        },
        departTime: {
            title: '预计出发时间',
            key: 'departTime',
            tooltip: true,
            width: 150,
            align: 'center'
        },
        dispatchStatus: {
            title: '派车状态',
            key: 'dispatchStatus',
            tooltip: true,
            width: 150,
            align: 'center',
            render (h, params) {
                let dispatchStatusMap = {
                    0: '待派车',
                    1: '已派车'
                }
                return h('div', dispatchStatusMap[params.row.dispatchStatus])
            }
        },
        driverName: {
            title: '司机姓名',
            key: 'driverName',
            tooltip: true,
            width: 130,
            align: 'center'
        },
        driverPhone: {
            title: '司机手机号',
            key: 'driverPhone',
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
                                that.dispatchOperationData.routePlanUuid = params.row.routePlanUuid
                                that.dispatchOperationData.applyOrderUuid = params.row.applyUuid
                                that.dispatchOperationData.actualDriverUuid = params.row.driverUuid
                                that.getOrderDetailByRouteUuid(params.row.routePlanUuid)
                                that.getdriverList();
                            }
                        }
                    }, '派车')
                ]);
            }
        }
    }
};
export const inputList = [
    // {
    //     name: 'drop-input', // 文本输入框名
    //     bind_key: 'vehicleScene', // 返回数据的key名
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
        bind_key: 'dispatchStatus', // 返回数据的key名
        dropList: [
            {
                label: '待派车',
                value: 0
            },
            {
                label: '已派车',
                value: 1
            }
        ],
        placeholder: '派车状态选择',
        value: '', // 用于数据绑定
        title: '派车状态：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '2', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'routePlanNo', // 返回数据的key名
        placeholder: '请输入订单编号',
        value: '', // 用于数据绑定
        title: '订单编号：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '3', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'date-time-input',
        bind_key: ['createBeginTime', 'createEndTime'],
        placeholder: '请选择下单时间',
        value: '',
        title: '下单时间：',
        titleWidth: 75,
        inputWidth: 300,
        key: '4',
        format: 'yyyy-MM-dd HH',
        isHide: false
    },
    // {
    //     name: 'text-input', // 文本输入框名
    //     bind_key: 'companyName', // 返回数据的key名
    //     placeholder: '请输入公司名',
    //     value: '', // 用于数据绑定
    //     title: '公司：', // 展示的字段名
    //     titleWidth: 50, // 展示的字段名的宽度
    //     key: '5', // 该文本框的唯一标识，用于匹配该文本框是否展示
    //     inputWidth: 200,
    //     isHide: false // false: 不隐藏 / true: 隐藏
    // },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'bussniseType', // 返回数据的key名
        dropList: [
            {
                label: '快车',
                value: 2
            },
            {
                label: '专车',
                value: 4
            }
        ],
        placeholder: '用车分类选择',
        value: '', // 用于数据绑定
        title: '用车分类：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '6', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    }
]
export const orderDetailMsg = [
    {
        title: '预计出发时间：',
        keytitle: 'departTime',
        value: ''
    },
    {
        title: '派车状态：',
        value: '',
        keytitle: 'dispatchStatus',
    },
    {
        title: '出发地：',
        value: '',
        keytitle: 'orgAddress',
    },
    {
        title: '司机姓名：',
        value: '',
        keytitle: 'actualDriverName',
    },
    {
        title: '目的地：',
        value: '',
        keytitle: 'destAddress',
    },
    {
        title: '司机手机号：',
        value: '',
        keytitle: 'actualDriverMobile',
    },
    {
        title: '下单人姓名：',
        value: '',
        keytitle: 'passengerName',
    },
    {
        title: '下单人手机号：',
        value: '',
        keytitle: 'passengerPhone',
    },
    {
        title: '预估里程：',
        value: '',
        keytitle: 'planTrip',
    },
    {
        title: '预估价格：',
        value: '',
        keytitle: 'planFare',
    }
]
export const modalSearchList = [
    {
        name: "cascader-input", // 文本输入框名
        bind_key: ["provinceID", "cityID", 'carrierId'], // 返回数据的key名
        placeholder: "请选择省/市/所属运营商",
        value: [], // 绑定返回数据
        cascaderList: [], // 级联列表
        title: "运营商：", // 展示的字段名
        titleWidth: 80, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: "1", // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false, // false: 不隐藏 / true: 隐藏
        changeOnSelect: true
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'driverPhone', // 返回数据的key名
        placeholder: '请输入司机手机号',
        value: '', // 用于数据绑定
        title: '司机手机号：', // 展示的字段名
        titleWidth: 80, // 展示的字段名的宽度
        key: '2', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 150,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'driverName', // 返回数据的key名
        placeholder: '请输入司机姓名',
        value: '', // 用于数据绑定
        title: '司机姓名：', // 展示的字段名
        titleWidth: 80, // 展示的字段名的宽度
        key: '3', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 150,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'driverStar', // 返回数据的key名
        dropList: [],
        placeholder: '司机星级选择',
        value: '', // 用于数据绑定
        title: '司机星级：', // 展示的字段名
        titleWidth: 80, // 展示的字段名的宽度
        key: '4', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 150,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'dayOrderNum', // 返回数据的key名
        placeholder: '请输入单数',
        value: '', // 用于数据绑定
        title: '日均订单：大于', // 展示的字段名
        titleWidth: 95, // 展示的字段名的宽度
        key: '5', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 135,
        isHide: false // false: 不隐藏 / true: 隐藏
    }
]
export const columns = [
    {
        type: "index",
        width: 60,
        align: "center",
        fixed: 'left'
    },
    {
        title: "司机手机号",
        key: "phone",
        align: "center",
        width: 120,
    },
    {
        title: "司机姓名",
        key: "driverName",
        align: "center",
        width: 120,
    },
    {
        title: "运营商",
        key: "carrierName",
        align: "center",
        width: 120,
    },
    {
        title: "司机星级",
        key: "driverStar",
        align: "center",
        width: 120,
    },
    {
        title: "车型",
        key: "vhicleType",
        align: "center",
        width: 120,
    },
    {
        title: "日均订单",
        key: "dayOrderNum",
        align: "center",
        width: 120,
    }
]
