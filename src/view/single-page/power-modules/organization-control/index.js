import { addOrg, deletaOrg } from '@/api/organization'

export const orgTypeMap = {
    0: '集团',
    1: '公司',
    2: '部门'
}

export const comTypeMap = {
    0: '集团公司',
    1: '子公司',
    2: '分公司',
    3: '合资公司',
    4: '加盟商'
}

export const orgTypeList = [
    {
        label: '公司',
        value: 1
    },
    {
        label: '部门',
        value: 2
    }
]
export const comTypeList = [
    {
        label: '集团公司',
        value: 0
    },
    {
        label: '子公司',
        value: 1
    },
    {
        label: '分公司',
        value: 2
    },
    {
        label: '合资公司',
        value: 3
    },
    {
        label: '加盟商',
        value: 4
    }
]

// index构造tree自定义结构
export const renderContent = (h, { root, node, data }, that) => {
    let addBtn = h('Button', {
        props: {
            size: 'small',
            type: 'success',
            ghost: true
        },
        style:{
            marginRight: '15px',
        },
        on: {
            click: () => {
                that.popViewAdd = true
                that.addParams = {
                    addType: 'org',
                    parentName: data.name,
                    parentType: data.type,
                    parentId: data.id
                }
            }
        }
    },'添加')
    let editBtn = h('Button', {
        props: {
            size: 'small',
            type: 'warning',
            ghost: true
        },
        style:{
            marginRight: '15px',
        },
        on: {
            click: () => { 
                that.popViewEdit = true
                that.params = JSON.parse(JSON.stringify(data))
            }
        }
    }, '编辑')
    let deleteBtn = h('Button', {
        props: {
            size: 'small',
            type: 'error',
            ghost: true
        },
        style:{
            marginRight: '15px',
        },
        on: {
            click: () => {
                that.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要删除该机构么？</p>',
                    cancelText: '取消',
                    onOk: () => {
                        deletaOrg({ ids: data.id }).then(res => {
                            that.$Message.success('删除成功')
                            that.getOrgTree()
                        })
                    }
                })
            }
        }
    }, '删除')
    let detailBtn = ''
    if(data.type == 3){
        detailBtn = h('Button', {
            props: {
                size: 'small',
                type: 'info',
                ghost: true
            },
            on: {
                click: () => {
                    that.popViewDetail = true
                    that.uuid = data.id
                }
            }
        },'详情')
    }

    return h('span', {
        class: {
            'tree-line': true
        }
    }, [
        h('span', {
            class: {
                'tree-line-underline': true
            }
        }),
        h('span', {
            style: {
                minWidth: 360-(that.getLevel(data.id)-1)*18 + 'px'
            }
        }, [
            h('Icon', {
                props: {
                    type: 'ios-paper-outline'
                }
            }),
            h('span', data.name)
        ]),
        h('span', {
            style: {
                display: 'inline-flex'
            }
        }, [ 
            h('span', {
                style: {
                    width: '120px',
                    minHeight: '48px'
                },
                class: {
                    'menu-table-header-td': true
                }
            }, orgTypeMap[data.type]),
            h('span', {
                style: {
                    width: '120px',
                    minHeight: '48px'
                },
                class: {
                    'menu-table-header-td': true
                }
            }, comTypeMap[data.nature]),
            h('span', {
                style: {
                    width: '300px',
                    minHeight: '48px'
                },
                class: {
                    'menu-table-header-td': true
                }
            }, data.remark),
            h('span',{
                style: {
                    width: '250px',
                    minWidth: '250px',
                    minHeight: '48px'
                },
                class: {
                    'menu-table-header-td': true
                }
            }, [addBtn, editBtn, deleteBtn, detailBtn])
        ])
    ])
}