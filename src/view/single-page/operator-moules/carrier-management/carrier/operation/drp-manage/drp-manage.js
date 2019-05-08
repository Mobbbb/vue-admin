import { deleteDrp } from '@/api/operator-carrier.js'

export const returnFields = (that) => {
    return [
    {
        title: '适用年',
        key: 'year',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '适用月',
        key: 'month',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '抽成比例',
        key: 'commision',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '创建时间',
        key: 'createTime',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '更新时间',
        key: 'updateTime',
        tooltip: true,
        minWidth: 100
    },
    {
        title: '操作人',
        key: 'updater',
        tooltip: true,
        minWidth: 100
    },
    {
        title:'操作',
        key:'action',
        width: 150,
        fixed: 'right',
        render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: "info",
                        ghost: true,
                        size: "small"
                    },
                    style: {
                        marginRight: '15px'
                    },
                    on: {
                        click: () => {
                            that.isPopDetail = true
                            that.drpUuid = params.row.uuid
                        }
                    }
                }, '查看'),
                h('Button', {
                    props: {
                        type: "error",
                        ghost: true,
                        size: "small"
                    },
                    on: {
                        click: () => {
                            that.$Modal.confirm({
                                title: '提示',
                                content: '<p>确认删除该设置？</p>',
                                cancelText: '取消',
                                onOk: () => {
                                    deleteDrp({uuid: params.row.uuid}).then(res => {
                                        if(that.tableData.length === 1 && that.current > 1){ 
                                                // 若删除项是当前页的最后一项，删除成功后，页码减一
                                                that.current --
                                            }
                                            that.$Message.success('删除成功')
                                            that.getTableList()
                                        })
                                }
                            })
                        }
                    }
                }, '删除')
                ]);
        }
    }
    ]
}


export const inputList = [
    {
        name: 'year-input', // 年份选择
        bind_key: 'year',
        placeholder: '请选择年份',
        value: '',
        title: '适用年：',
        titleWidth: 65,
        inputWidth: 200, // input框的宽度
        key: '6',
        isHide: false
    },
    {
        name: 'drop-input', // 下拉选择框
        bind_key: 'month',
        placeholder: '请选择月份',
        value: '',
        title: '适用月：',
        titleWidth: 65,
        inputWidth: 200, // input框的宽度
        dropList: [
        {
            label: '1月',
            value: 1
        },
        {
            label: '2月',
            value: 2
        },
        {
            label: '3月',
            value: 3
        },
        {
            label: '4月',
            value: 4
        },
        {
            label: '5月',
            value: 5
        },
        {
            label: '6月',
            value: 6
        },
        {
            label: '7月',
            value: 7
        },
        {
            label: '8月',
            value: 8
        },
        {
            label: '9月',
            value: 9
        },
        {
            label: '10月',
            value: 10
        },
        {
            label: '11月',
            value: 11
        },
        {
            label: '12月',
            value: 12
        },
        ],
        key: '5',
        isHide: false
    },
]