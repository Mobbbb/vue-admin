import { downPayway, upPayway, changePaywayStatus } from '@/api/finance'

const statusMap = {
    1: '启用',
    2: '禁用'
}

export const returnColumns = (that) => {
    let emptyBtn = (h) => {
        return h('div', {
            style: {
                display: 'inline-block',
                marginRight: '15px',
                width: '40px',
                height: '22px'
            }
        })
    }
    let upBtn = (h, params) => {
        return h('Button', {
            props: {
              type: "primary",
              ghost: true,
              size: "small"
            },
            directives: [{
                name: 'hasAuth',
                value: 'payway-management-up'
            }],
            style: {
                marginRight: '15px'
            },
            on: {
                click: () => {
                    upPayway({ uuid: params.row.uuid }).then(res => {
                        that.getTableList()
                        that.$Message.success('操作成功')
                    })
                }
            }
        }, '上移')
    }
    let downBtn = (h, params) => {
        return h('Button', {
            props: {
              type: "error",
              ghost: true,
              size: "small"
            },
            directives: [{
                name: 'hasAuth',
                value: 'payway-management-down'
            }],
            style: {
                marginRight: '15px'
            },
            on: {
                click: () => {
                    downPayway({ uuid: params.row.uuid }).then(res => {
                        that.getTableList()
                        that.$Message.success('操作成功')
                    })
                }
            }
        }, '下移')
    }
    let switchBtn = (h, params, text) => {
        return h('Button', {
            props: {
              type: params.row.channelStatus === 1 ? 'warning' : 'success',
              ghost: true,
              size: "small"
            },
            directives: [{
                name: 'hasAuth',
                value: 'payway-management-update'
            }],
            on: {
                click: () => {
                    let status = 1
                    if(params.row.channelStatus === 1) status = 2
                    let data = {
                        channelStatus: status,
                        uuid: params.row.uuid
                    }
                    changePaywayStatus(data).then(res => {
                        that.getTableList()
                        that.$Message.success(text + '成功')
                    })
                }
            }
        }, text)
    }
	return [
        {
            title: '顺序',
            key: 'xxxx',
            tooltip: true,
            width: 150,
            render: (h, params) => {
                return h('span', 1 + params.index)
            }
        },
        {
            title: '支付方式',
            key: 'payName',
            minWidth: 100,
            tooltip: true,
        },
        {
            title: '状态',
            key: 'channelStatus',
            minWidth: 100,
            tooltip: true,
            render: (h, params) => {
                return h('div', statusMap[params.row.channelStatus])
            }
        },
        {
            title:'操作',
            key:'action',
            width: 200,
            fixed: 'right',
            render: (h, params) => {
                let text = '开启'
                if(params.row.channelStatus === 1) text = '关闭'
                if(!params.index){ // 第一个
                    return h('div', [
                        emptyBtn(h),
                        downBtn(h, params),
                        switchBtn(h, params, text)
                    ])
                } else if(params.index === that.tableData.length - 1){ // 最后一个
                    return h('div', [
                        upBtn(h, params),
                        emptyBtn(h),
                        switchBtn(h, params, text)
                    ])
                } else {
                    return h('div', [
                        upBtn(h, params),
                        downBtn(h, params),
                        switchBtn(h, params, text)
                    ])
                }
            }
        }
    ]
}