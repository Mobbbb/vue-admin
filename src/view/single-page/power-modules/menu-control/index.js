import { deleteMenu } from '@/api/power-data'

export const renderContent = (h, { root, node, data }, that) => {
	let color = ''
    let addBtn = h('Button', {
        props: {
            size: 'small',
            type: 'success',
            ghost: true
        },
        style:{
            marginRight: '15px',
            //display: that.$utils.pkAccess('menu_control_add') === true ? 'inline-block' : 'none'
        },
        on: {
            click: () => {
                that.popViewAdd = true
                that.addParams = {
                    parentName: data.resourceName,
                    resourceParent: data.uuid,
                    resourceType: 0,
                    resourceUrl: '',
                    resourceName: '',
                    permissionsUrl: '',
                    menuIcon: ''
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
            //display: that.$utils.pkAccess('menu_control_edit') === true ? 'inline-block' : 'none'
        },
        on: {
            click: () => { 
                that.popViewEditor = true
                that.editParams = {
                    uuid: data.uuid,
                    resourceType: data.resourceType,
                    resourceUrl: data.resourceUrl,
                    resourceName: data.resourceName,
                    permissionsUrl: data.permissionsUrl,
                    menuIcon: data.menuIcon
                }
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
            //display: that.$utils.pkAccess('menu_control_delete') === true ? 'inline-block' : 'none'
        },
        on: {
            click: () => {
                that.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要删除吗？</p>',
                    cancelText: '取消',
                    onOk: () => {
                        deleteMenu({uuid: data.uuid}).then(res => {
                            if(res.data.success){
                                that.$Message.success('删除成功!')
                                that.getTableList()
                            }
                        })
                    }
                })
            }
        }
    },'删除')

    if(data.resourceType === 0) color = '#337ab7'
    else if(data.resourceType === 2) color = '#5cb85c'
    else color = '#f0ad4e'

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
        h('span', [
            h('Icon', {
                props: {
                    type: 'ios-paper-outline'
                },
                style: {
                    marginRight: '8px',
                }
            }),
            h('span', data.resourceName)
        ]),
        h('span', {
            style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
            }
        }, [ 
            h('span', {
                style: {
                    width: '200px',
                    display: 'inline-block',
                    fontSize: '12px',
                }
            }, data.menuIcon),
            h('span', {
                style: {
                    marginRight: '55px',
                    fontSize: '12px',
                    background: color,
                    color: 'white',
                    padding: '.2em .6em .3em',
                    'border-radius': '.25em'
                }
            }, data.typeName),
            h('span',{
                style: {
                    width: '160px',
                    display: 'inline-block'
                }
            },[addBtn, editBtn, deleteBtn])
        ])
    ])
}