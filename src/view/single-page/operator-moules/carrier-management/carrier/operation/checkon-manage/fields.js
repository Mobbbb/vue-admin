export const returnFields = (that) => {
    // 考勤
    return {
        csmNum: {
            title: '序号',
            key: 'csmNum',
            tooltip: true,
            minWidth: 65,
            render: (h, params) => {
                return h('div', that.checkon.pageSize*(that.checkon.current - 1) + params.index + 1)
            }
        },
        strategyName: {
            title: '策略名',
            key: 'strategyName',
            tooltip: true,
            minWidth: 160
        },
        strategyType: {
            title: '策略类型',
            key: 'strategyType',
            tooltip: true,
            minWidth: 140
        },
        city: {
            title: '适用城市',
            key: 'city',
            tooltip: true,
            minWidth: 140
        },
        name: {
            title: '适用运营商',
            key: 'name',
            tooltip: true,
            minWidth: 140
        },
        status: {
            title: '状态',
            key: 'status',
            tooltip: true,
            minWidth: 80,
            render: (h, params) => {
                let titles = params.row.isDel == 1 ? '已停用' : '使用中'
                return h('div', titles)
            }
        },
        action: {
            title: '操作',
            key: 'action',
            width: 200,
            render: (h, params) => {
                let is_del = params.row.isDel
                let titlesfont = is_del == 1 ? '启用' : '停用'
                return h('div', [
                    h('Button', {
                        'class': {
                            tableBtn: true
                        },
                        props: {
                            type: "info",
                            ghost: true,
                            size: "small"
                        },
                        on: {
                            click: () => {
                                let idx = params.index
                                let tableData = JSON.parse(JSON.stringify(that.checkon.rootTabelData))
                                tableData[idx].dayOnlineEnable = tableData[idx].dayOnlineEnable === 1 ? true : false
                                tableData[idx].dayOrdersEnable = tableData[idx].dayOrdersEnable === 1 ? true : false
                                // if (tableData[idx].city == 1) {
                                //   tableData[idx].city = '1'
                                // } else {
                                //   tableData[idx].city = tableData[idx].cityId
                                // }
                                that.cityCodeArrayCheckon = (tableData[idx].city && tableData[idx].city.toString().split(',')) || []
                                // that.optionArray = tableData[idx].uuid.split(',')
                                that.checkonmadaldata = tableData[idx]
                                that.checkoneditornew = '查看策略'
                                that.isdisabled = true
                                that.checkonModal = true
                            }
                        }
                    }, '查看'),
                    h('Button', {
                        'class': {
                            tableBtn: true
                        },
                        props: {
                            type: "warning",
                            ghost: true,
                            size: "small"
                        },
                        on: {
                            click: () => {
                                let idx = params.index
                                let tableData = JSON.parse(JSON.stringify(that.checkon.rootTabelData))
                                tableData[idx].dayOnlineEnable = tableData[idx].dayOnlineEnable === 1 ? true : false
                                tableData[idx].dayOrdersEnable = tableData[idx].dayOrdersEnable === 1 ? true : false
                                // if (tableData[idx].city == 1) {
                                //   tableData[idx].city = '1'
                                // } else {
                                //   tableData[idx].city = tableData[idx].cityId
                                // }
                                // that.optionArray = tableData[idx].uuid.split(',')
                                that.cityCodeArrayCheckon = (tableData[idx].city && tableData[idx].city.toString().split(',')) || []
                                that.checkonmadaldata = tableData[idx]
                                that.checkoneditornew = '编辑'
                                that.editIndex = idx
                                that.editStatus = true
                                that.isdisabled = false
                                that.checkonModal = true
                            }
                        }
                    }, '编辑'),
                    h('Button', {
                        props: {
                            type: is_del == 1 ? 'info' : "error",
                            ghost: true,
                            size: "small"
                        },
                        on: {
                            click: () => {
                                let idx = params.index
                                that.deleteflag = 'checkonflag'
                                that.deleteIndex = idx
                                if (is_del == 1) {
                                    that.restartModel = true
                                } else {
                                    that.deleteModel = true
                                }
                            }
                        }
                    }, titlesfont)
                ])
            }
        }
    }
}
