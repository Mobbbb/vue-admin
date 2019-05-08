export const config = [
    {
        min: 0,
        max: 99999,
        unit: ['%', '元'],
        lastConfig: '+∞',
        assessment: '车均实时流水（元）',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 1,
        assessmentType: 1
    },
    {
        min: 0,
        max: 99999,
        unit: ['%', '单'],
        lastConfig: '+∞',
        assessment: '车均已完成订单（单）',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 2,
        assessmentType: 2
    },
    {
        min: 0,
        max: 5,
        unit: ['%', '分'],
        lastConfig: '5',
        assessment: '司机星级（分）',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 3,
        assessmentType: 3
    },
    {
        min: 0,
        max: 1440,
        unit: ['%', '分钟'],
        lastConfig: '1440',
        assessment: '日均高峰时长（分钟）',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 4,
        assessmentType: 4
    },
    {
        min: 0,
        max: 1440,
        unit: ['%', '分钟'],
        lastConfig: '1440',
        assessment: '日均在线时长（分钟）',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 5,
        assessmentType: 5
    },
    {
        min: 0,
        max: 100,
        unit: ['%'],
        lastConfig: '100',
        assessment: '日均在线率',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 6,
        assessmentType: 6
    },
    {
        min: 0,
        max: 100,
        unit: ['%'],
        lastConfig: '0',
        assessment: '司机流失率',
        lineValue: [
            { value: 0 },
            { value: 100 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 7,
        assessmentType: 7
    },
    {
        min: 0,
        max: 100,
        unit: ['%'],
        lastConfig: '0',
        assessment: '空驶率',
        lineValue: [
            { value: 0 },
            { value: 100 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 8,
        assessmentType: 8
    },
    {
        min: 0,
        max: 100,
        unit: ['%'],
        lastConfig: '100',
        assessment: '成单率',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 9,
        assessmentType: 9
    },
    {
        min: 0,
        max: 100,
        unit: ['%'],
        lastConfig: '100',
        assessment: '司机招聘完成率',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 10,
        assessmentType: 10
    },
    {
        min: 0,
        max: 100,
        unit: ['%'],
        lastConfig: '100',
        assessment: '司机合规率',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 11,
        assessmentType: 11
    },
    {
        min: 0,
        max: 100,
        unit: ['%'],
        lastConfig: '100',
        assessment: '临时事件完成率',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 12,
        assessmentType: 12
    },
    {
        min: 0,
        max: 100,
        unit: ['%'],
        lastConfig: '100',
        assessment: '接单率',
        lineValue: [
            { value: 0 },
            { value: 0 },
            { value: null },
            { value: null },
            { value: null },
            { value: null },
        ],
        sort: 13,
        assessmentType: 13
    }
]



let titleList = ['车均实收流水', '车均已完成订单','司机星级','日均高峰时长','日均在线时长','日均在线率',
'司机流失率','空驶率','成单率','司机招聘完成率','司机合规率','临时事件完成率', '接单率']

export const columns = [
    {
        title: ' ',
        key: 'xxxxx',
        width: 120,
        render: (h, params) => {
            return h('div', titleList[params.index])
        }
    },
    {
        title: '权重',
        key: 'weights',
        tooltip: true,
        width: 80
    },
    {
        title: '结果',
        key: 'result',
        tooltip: true,
        width: 120
    },
    {
        title: '得分',
        key: 'score',
        tooltip: true,
        width: 80
    },
    {
        title: '备注',
        key: 'remark',
        tooltip: true,
        minWidth: 150
    }
]

