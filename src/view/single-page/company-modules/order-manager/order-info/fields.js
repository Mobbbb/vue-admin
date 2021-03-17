
/* 订单管理--订单信息 */
export const returnFields = that => {
    return {
        // sceneId: {
        //     title: '用车场景',
        //     key: 'sceneId',
        //     tooltip: true,
        //     minWidth: 100,
        //     align: 'center'
        // },
        orderType: {
            title: '订单类型',
            key: 'orderType',
            tooltip: true,
            minWidth: 100,
            align: 'center',
            render(h, params) {
                let orderTypeMap = {
                    1: '实时', 2: '预约'
                }
                return h('div', orderTypeMap[params.row.orderType])
            }
        },
        orderNo: {
            title: '订单编号',
            key: 'orderNo',
            tooltip: true,
            minWidth: 150,
            align: 'center'
        },
        demandNo: {
            title: '申请单编号',
            key: 'demandNo',
            tooltip: true,
            minWidth: 180,
            align: 'center'
        },
        orderorPhone: {
            title: '下单手机号',
            key: 'orderorPhone',
            tooltip: true,
            minWidth: 100,
            align: 'center'
        },
        orderor: {
            title: '下单姓名',
            key: 'orderorName',
            tooltip: true,
            minWidth: 100,
            align: 'center'
        },
        passengerPhone: {
            title: '乘车人手机号',
            key: 'passengerPhone',
            tooltip: true,
            minWidth: 120,
            align: 'center'
        },
        passenger: {
            title: '乘车人姓名',
            key: 'passengerName',
            tooltip: true,
            minWidth: 110,
            align: 'center'
        },
        orderTime: {
            title: '下单时间',
            key: 'orderTime',
            tooltip: true,
            width: 190,
            align: 'center',
            render: (h, params)=>{
                let time = params.row.orderTime ? that.$moment(params.row.orderTime).format('YYYY-MM-DD HH:mm:ss') : '';
                return h('span', time);
            }
        },
        enterpriseName: {
            title: '企业名称',
            key: 'enterpriseName',
            tooltip: true,
            width: 150,
            align: 'center'
        },
        vehicleType: {
            title: '用车分类',
            key: 'vehicleType',
            tooltip: true,
            width: 130,
            align: 'center',
            render(h, params) {
                let vehicleTypeMap = {
                    1: '出租车', 2: '专车', 3: '拼车', 4: '快车'
                }
                return h('div', vehicleTypeMap[params.row.vehicleType])
            }
        },
        planFee: {
            title: '订单金额',
            key: 'planFee',
            tooltip: true,
            width: 150,
            align: 'center'
        },
        orderStatus: {
            title: '订单状态',
            key: 'orderStatus',
            tooltip: true,
            width: 150,
            align: 'center',
            render(h, params) {
                let orderStatusMap = {
                    0: '约车中', 1: '预约中', 2: '接乘中', 3: '已抵达接乘地', 4: '载乘中', 5: '已抵达目的地', 6: '待支付', 7: '待评价', 8: '行程结束', 9: '行程取消'
                }
                return h('div', orderStatusMap[params.row.orderStatus])
            }
        },
        // payTime: {
        //     title: '支付时间',
        //     key: 'payTime',
        //     tooltip: true,
        //     width: 150,
        //     align: 'center'
        // },
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
                                if (params.row.routePlanUuid) {
                                    that.$router.push({ path: 'orderdetail', query: { id: params.row.routePlanUuid, applyNo: params.row.demandNo } })
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
    //             value: 1
    //         },
    //         {
    //             label: '出差用车',
    //             value: 2
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
        bind_key: 'orderType', // 返回数据的key名
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
        bind_key: 'orderNo', // 返回数据的key名
        placeholder: '请输入订单编号',
        value: '', // 用于数据绑定
        title: '订单编号：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '3', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'orderorPhone', // 返回数据的key名
        placeholder: '请输入下单人手机号',
        value: '', // 用于数据绑定
        title: '下单人手机号：', // 展示的字段名
        titleWidth: 90, // 展示的字段名的宽度
        key: '4', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'orderor', // 返回数据的key名
        placeholder: '请输入下单人姓名',
        value: '', // 用于数据绑定
        title: '下单人姓名：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '5', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'passengerPhone', // 返回数据的key名
        placeholder: '请输入乘车人手机号',
        value: '', // 用于数据绑定
        title: '乘车人手机号：', // 展示的字段名
        titleWidth: 90, // 展示的字段名的宽度
        key: '6', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'passenger', // 返回数据的key名
        placeholder: '请输入乘车人姓名',
        value: '', // 用于数据绑定
        title: '乘车人姓名：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '7', // 该文本框的唯一标识，用于匹配该文本框是否展示
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
        key: '8',
        isHide: false
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'enterpriseName', // 返回数据的key名
        placeholder: '请输入企业名',
        value: '', // 用于数据绑定
        title: '企业名称：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '9', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'vehicleType', // 返回数据的key名
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
        key: '10', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'drop-input', // 文本输入框名
        bind_key: 'orderStatus', // 返回数据的key名
        dropList: [
            {
                label: '约车中',
                value: 0
            },
            {
                label: '预约中',
                value: 1
            },
            {
                label: ' 接乘中',
                value: 2
            },
            {
                label: ' 已抵达接乘地',
                value: 3
            },
            {
                label: ' 载乘中',
                value: 4
            },
            {
                label: ' 已抵达目的地',
                value: 5
            },
            {
                label: ' 待支付',
                value: 6
            },
            {
                label: ' 待评价',
                value: 7
            },
            {
                label: ' 行程结束',
                value: 8
            },
            {
                label: ' 行程取消',
                value: 9
            }
        ],
        placeholder: '订单状态选择',
        value: '', // 用于数据绑定
        title: '订单状态：', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '11', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
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
