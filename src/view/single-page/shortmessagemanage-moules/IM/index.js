/**
 * Created by liuzhen on 2018/12/27 11:05.
 */

export const Columns = (that) => {
    return {
        indexline: {
            title: '序号',
            key: 'indexline',
            width: 80,
            render: (h, params) => {
                let idx = params.index + 1
                return h('div', idx)
            }
        },
        deviceObj: {
            title: '模板对象',
            width: 160,
            key: 'sendName',
            render: (h, params) => {
                let titles = params.row.sendName == '1'? '司机' : '乘客'
                return h('div', titles)
            },
        },
        deviceContent: {
            title: '消息内容',
            key: 'imContent',
            tooltip: true,
            render: (h, params) => {
                let imcont = params.row.imContent
                return h('div', [
                    h('span', {
                        style: {
                            textAlign: 'left'
                        }
                    }, imcont)
                ])
            }
        },
        deviceTime: {
            title: '更新时间',
            width: 160,
            key: 'createdOn',
            render: (h, params) => {
                let titles = params.row.createdOn
                return h('div', titles)
            }
        },
        action: {
            title: '操作',
            key: 'operation',
            width: 160,
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'warning',
                            ghost: true,
                            size: 'small'
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'shortmessage-IM-driverEdit'
                        }],
                        style: {
                            marginRight: '15px'
                        },
                        on: {
                            click: () => {
                                that.$refs['editForm'].resetFields();
                                that.sendObject = '司机'
                                that.editForm.uuid = params.row.uuid
                                that.editForm.imContent = params.row.imContent
                                that.editMobel = true
                                that.editForm.sendName = that.tabName == 'driverSide'? 1 : 2
                            }
                        }
                    }, '编辑'),
                    h('Button', {
                        props: {
                            type: 'error',
                            ghost: true,
                            size: 'small'
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'shortmessage-IM-driverDelete'
                        }],
                        on: {
                            click: () => {
                                that.$Modal.confirm({
                                    title: '提示',
                                    content: '<p>确定要删除吗？</p>',
                                    cancelText: '取消',
                                    onOk: () => {
                                        that.handleDeleteItem(params.row.uuid)
                                    }
                                })
                            }
                        }
                    }, '删除')
                ]);
            }
        }
    }
}
export const conversationColumns = (that) => {
    return {
        indexline: {
            title: '序号',
            key: 'indexline',
            tooltip: true,
            width: 80
        },
        driverName: {
            title: '司机姓名',
            key: 'driverName',
            tooltip: true,
            minWidth: 160
        },
        driverMobie: {
            title: '司机手机号',
            key: 'driverMobie',
            tooltip: true,
            minWidth: 160
        },
        passengerName: {
            title: '乘客姓名',
            key: 'passengerName',
            tooltip: true,
            minWidth: 160
        },
        passengerMobie: {
            title: '乘客手机号',
            key: 'passengerMobie',
            tooltip: true,
            minWidth: 160
        },
        orderNumber: {
            title: '订单编号',
            key: 'orderNumber',
            tooltip: true,
            minWidth: 160
        },
        creatTime: {
            title: '下单时间',
            key: 'creatTime',
            tooltip: true,
            minWidth: 160
        },
        action: {
            title: '操作',
            key: 'operation',
            width: 160,
            fixed: 'right',
            tooltip: true,
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'success',
                            ghost: true,
                            size: 'small'
                        },
                        style: {
                            marginRight: '15px'
                        },
                        'class': {
                            tableBtn: true
                        },
                        on: {
                            click: () => {
                                that.editForm.uuid = params.row.uuid
                                that.editForm.imContent = params.row.imContent
                                that.chartRecord = true
                            }
                        }
                    }, '详情')
                ]);
            }
        }
    }
}
export const inputList = [
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'oder_number', // 返回数据的key名
        placeholder: '请输入订单编号',
        value: '', // 用于数据绑定
        title: '订单编号', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'driver_name', // 返回数据的key名
        placeholder: '请输入司机姓名',
        value: '', // 用于数据绑定
        title: '司机姓名', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'driver_mobile', // 返回数据的key名
        placeholder: '请输入司机手机号',
        value: '', // 用于数据绑定
        title: '司机手机号', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'passenger_name', // 返回数据的key名
        placeholder: '请输入乘客姓名',
        value: '', // 用于数据绑定
        title: '乘客姓名', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'text-input', // 文本输入框名
        bind_key: 'passenger_mobile', // 返回数据的key名
        placeholder: '请输入乘客手机号',
        value: '', // 用于数据绑定
        title: '乘客手机号', // 展示的字段名
        titleWidth: 75, // 展示的字段名的宽度
        key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
        inputWidth: 200,
        isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
        name: 'date',
        bind_key: 'creat_time',
        placeholder: '请选择下单时间',
        value: '',
        title: '下单时间：',
        titleWidth: 75,
        inputWidth: 200,
        unicode: '4',
        isHide: false
    },
]
export const dataDevice = [
    {
        name: '司机',
        msg: '你好，定位准确吗？我按导航去接你',
        date: '2018-02-01 12:11:11'
    },
    {
        name: '司机',
        msg: '你好，定位准确吗？我按导航去接你',
        date: '2018-02-01 12:11:11'
    },
    {
        name: '司机',
        msg: '你好，定位准确吗？我按导航去接你',
        address: 'Sydney No. 1 Lake Park',
        date: '2018-02-01 12:11:11'
    },
    {
        name: '司机',
        msg: '你好，定位准确吗？我按导航去接你',
        date: '2018-02-01 12:11:11'
    }
]
