/* 运营管理-考勤管理 */
export const returnDayilyFields = (that) => { // 日考勤规则
    return {
        city: {
            title: '运营区域',
            key: 'cityName',
            tooltip: true,
            width: 300
        },
        dayOnline: {
            title: '日在线时长',
            key: 'onlineDuration',
            tooltip: true,
            minWidth: 180
        },
        hightOnline: {
            title: '日高峰时长',
            key: 'heightDuration',
            tooltip: true,
            minWidth: 100
        },
        updateTime: {
            title: '更新时间',
            key: 'updateTime',
            tooltip: true,
            minWidth: 120
        },
        action: {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 180,
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: "warning",
                            ghost: true,
                            size: "small"
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'assessment-rule-day-edit'
                        }],
                        'class': {
                            tableBtn: true
                        },
                        on: {
                            click: () => {
                                that.uuid = params.row.uuid
                                that.auditHandle(params.row.uuid);
                            }
                        }
                    }, '编辑'),
                    h('Button', {
                        props: {
                            type: "info",
                            ghost: true,
                            size: "small"
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'assessment-rule-day-detail'
                        }],
                        on: {
                            click: () => {
                                that.detailHandle(params.row.uuid)
                            }
                        }
                    }, '详情')
                ])
            }
        }
    }
}
export const returnMonthFields = (that) => { // 月考勤规则
    return {
        cityName: {
            title: '运营区域',
            key: 'cityName',
            tooltip: true,
            width: 200
        },
        examineYear: {
            title: '适用年',
            key: 'examineYear',
            tooltip: true,
            minWidth: 180
        },
        month: {
            title: '适用月',
            key: 'month',
            tooltip: true,
            minWidth: 100
        },
        day: {
            title: '有效出勤天数',
            key: 'day',
            tooltip: true,
            minWidth: 120,
            render: (h, params) => {
                let newDay = params.row.day
                return h('div', [
                    h('span', {
                        style:{
                            display: params.row.edit === false ? 'inline-block' : 'none'
                        }
                    }, params.row.day),
                    h('InputNumber',{
                        style:{
                            display: params.row.edit === true ? 'inline-block' : 'none',
                            textAlign:'center',
                            width:'100%'
                        },
                        attrs:{
                            value: newDay,
                            min:0,
                            max:31
                        },
                        on:{
                            'on-change': (event) => {
                                params.row.day = event
                            }
                        }
                    })
                ])
            }
        },
        updateTime: {
            title: '更新时间',
            key: 'updateTime',
            tooltip: true,
            minWidth: 160
        },
        action: {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: "warning",
                            ghost: true,
                            size: "small"
                        },
                        directives: [{
                            name: 'hasAuth',
                            value: 'assessment-rule-month-edit'
                        }],
                        'class': {
                            tableBtn: true
                        },
                        style: {
                            display: params.row.edit === false ? 'inline-block' : 'none'
                        },
                        on: {
                            click: () => {
                                // let editId = params.row.uuid;
                                // that.auditHandle(editId);
                                params.row.edit = true
                            }
                        }
                    }, '编辑'),
                    h('Button', {
                        props: {
                            type: "primary",
                            ghost: true,
                            size: "small"
                        },
                        'class': {
                            tableBtn: true
                        },
                        style: {
                            display: params.row.edit === true ? 'inline-block' : 'none'
                        },
                        on: {
                            click: () => {
                                let paramsData = {
                                    examineType: 'M',
                                    day: params.row.day,
                                    uuid: params.row.uuid,
                                    month: params.row.month
                                }
                                that.auditMonthRule(paramsData)
                                params.row.edit = false
                            }
                        }
                    }, '保存')
                ])
            }
        }
    }
}

export const allMonths = [
    {
        title: '全部',
        value: '0',
        parentId: '000',
        expand: true
    },
    {
        title: '1月',
        value: 1,
        parentId: '0'
    },
    {
        title: '2月',
        value: 2,
        parentId: '0'
    },
    {
        title: '3月',
        value: 3,
        parentId: '0'
    },
    {
        title: '4月',
        value: 4,
        parentId: '0'
    },
    {
        title: '5月',
        value: 5,
        parentId: '0'
    },
    {
        title: '6月',
        value: 6,
        parentId: '0'
    },
    {
        title: '7月',
        value: 7,
        parentId: '0'
    },
    {
        title: '8月',
        value: 8,
        parentId: '0'
    },
    {
        title: '9月',
        value: 9,
        parentId: '0'
    },
    {
        title: '10月',
        value: 10,
        parentId: '0'
    },
    {
        title: '11月',
        value: 11,
        parentId: '0'
    },
    {
        title: '12月',
        value: 12,
        parentId: '0'
    }
]

export const dInputList = [
    {
        name: 'cascader-input', // 文本输入框名
        bind_key: ['provinceId', 'cityUuid'], // 返回数据的key名
        placeholder: '请选择省/市',
        value: [], // 绑定返回数据
        cascaderList: [], // 级联列表
        title: '省 / 市：', // 展示的字段名
        titleWidth: 65, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: '666', // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false, // false: 不隐藏 / true: 隐藏
        changeOnSelect: true
    },
]

export const mInputList = [
    {
        name: 'cascader-input', // 文本输入框名
        bind_key: ['provinceId', 'cityUuid'], // 返回数据的key名
        placeholder: '请选择省/市',
        value: [], // 绑定返回数据
        cascaderList: [], // 级联列表
        title: '省 / 市：', // 展示的字段名
        titleWidth: 65, // 展示的字段名的宽度
        inputWidth: 200, // input框的宽度
        key: '666', // 该文本框的唯一标识，用于匹配该文本框是否展示
        isHide: false, // false: 不隐藏 / true: 隐藏
        changeOnSelect: true
    },
    {
        name: 'year-input', // 年份选择
        bind_key: 'examineYear',
        placeholder: '请选择年份',
        value: '',
        title: '适用年：',
        titleWidth: 65,
        inputWidth: 200, // input框的宽度
        key: '6',
        isHide: false
    }
]