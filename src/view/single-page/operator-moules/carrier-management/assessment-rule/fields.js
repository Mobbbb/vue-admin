/* 运营管理-考勤管理 */
export const returnDayilyFields = (that) => { // 日考勤规则
    return [
        {
            title: '运营区域',
            key: 'cityName',
            tooltip: true,
            width: 300
        },
        {
            title: '日在线时长',
            key: 'onlineDuration',
            tooltip: true,
            minWidth: 180
        },
        {
            title: '日高峰时长',
            key: 'heightDuration',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '更新时间',
            key: 'updateTime',
            tooltip: true,
            minWidth: 120
        },
        {
            title: '版本号',
            key: 'version',
            tooltip: true,
            minWidth: 120
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 180,
            slot: 'action'
        }
    ]
}

// 月考勤规则
export const returnMonthFields = (that) => {
    return [
        {
            title: '运营区域',
            key: 'cityName',
            tooltip: true,
            width: 200
        },
        {
            title: '适用年',
            key: 'examineYear',
            tooltip: true,
            minWidth: 180
        },
        {
            title: '适用月',
            key: 'month',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '休息天数',
            key: 'day',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '有效出勤天数',
            key: 'attendanceDays',
            tooltip: true,
            minWidth: 120,
        },
        {
            title: '日均在线时长',
            key: 'onlineDuration',
            tooltip: true,
            minWidth: 100
        },
        {
            title: '日均高峰在线时长',
            key: 'heightDuration',
            tooltip: true,
            minWidth: 120
        },
        {
            title: '更新时间',
            key: 'updateTime',
            tooltip: true,
            minWidth: 160
        },
        {
            title: '版本号',
            key: 'version',
            tooltip: true,
            minWidth: 160 
        },
        {
            title: '操作',
            key: 'action',
            slot: 'action',
            fixed: 'right',
            width: 180
        }
    ]
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

// 日考勤历史版本
export const dRevisionColumns = (that) => {
    return [
        {
            title: '日在线时长',
            key: 'onlineDuration',
            tooltip: true,
            minWidth: 160 
        },
        {
            title: '日高峰在线时长',
            key: 'heightDuration',
            tooltip: true,
            minWidth: 160 
        },
        {
            title: '创建时间',
            key: 'createTime',
            tooltip: true,
            minWidth: 160 
        },
        {
            title: '版本号',
            key: 'version',
            tooltip: true,
            minWidth: 160 
        },
    ]
}

// 月考勤历史版本
export const mRevisionColumns = (that) => {
    return [
        {
            title: '休息天数',
            key: 'day',
            tooltip: true,
            minWidth: 160 
        },
        {
            title: '有效出勤天数',
            key: 'attendanceDays',
            tooltip: true,
            minWidth: 160 
        },
        {
            title: '日均在线时长',
            key: 'onlineDuration',
            tooltip: true,
            minWidth: 160 
        },
        {
            title: '日均高峰在线时长',
            key: 'heightDuration',
            tooltip: true,
            minWidth: 160 
        },
        {
            title: '创建时间',
            key: 'createTime',
            tooltip: true,
            minWidth: 160 
        },
        {
            title: '版本号',
            key: 'version',
            tooltip: true,
            minWidth: 120,
            fixed: 'right'
        },
    ]
}

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

export const restDayList = [
    {
        value: 1,
        label: 1
    },
    {
        value: 2,
        label: 2
    },
    {
        value: 3,
        label: 3
    },
    {
        value: 4,
        label: 4
    },
    {
        value: 5,
        label: 5
    },
    {
        value: 6,
        label: 6
    },
    {
        value: 7,
        label: 7
    },
    {
        value: 8,
        label: 8
    },
    {
        value: 9,
        label: 9
    },
    {
        value: 10,
        label: 10
    },
    {
        value: 11,
        label: 11
    },
    {
        value: 12,
        label: 12
    },
    {
        value: 13,
        label: 13
    },
    {
        value: 14,
        label: 14
    },
    {
        value: 15,
        label: 15
    }
]