import { treeDataTranslate, popParentNode } from '@/libs/tools'
import { getMenuList, getMenuByRoleId, deleteRole } from '@/api/power-data'

export const roleTableColumns = (that) => {
    let editBtn = (h, params) => {
        return h('Button', {
            props: {
                type: "warning",
                ghost: true,
                size: "small"
            },
            style:{
                marginRight: '15px',
                display: that.$utils.pkAccess('role_control_edit') === true ? 'inline-block' : 'none'
            },
            on: {
                click: () => {
                    that.popView = true
                    that.title = '编辑角色'
                    that.params.Loading = true
                    getMenuList().then(res => { // 获取菜单列表
                        getMenuByRoleId({ uuid: params.row.uuid }).then(response => { // 获取该角色拥有的菜单
                            let treeData = JSON.parse(JSON.stringify(res.data.data))
                            let listData = JSON.parse(JSON.stringify(res.data.data))
                            let data = popParentNode(treeData, response.data.data)
                            for (let i = 0; i < treeData.length; i++) { // 勾选返回的菜单
                                for (let j = 0; j < data.length; j++) {
                                    if (treeData[i].uuid === data[j]) {
                                        treeData[i].checked = true
                                    }
                                }
                                treeData[i].title = treeData[i].resourceName
                            }
                            treeData = treeDataTranslate(treeData, 'uuid', 'resourceParent')
                            that.params = {
                                uuid: params.row.uuid,
                                roleName: params.row.name,
                                treeData: treeData,
                                listData: listData,
                                Loading: false,
                                type: 'edit'
                            }
                        })
                    })
                }
            }
        }, '编辑')
    }
    let deleteBtn = (h, params) => {
        return h('Button', {
            props: {
                type: "error",
                ghost: true,
                size: "small"
            },
            style:{
                display: that.$utils.pkAccess('role_control_delete') === true ? 'inline-block' : 'none'
            },
            on: {
                click: () => {
                    that.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要删除吗？</p>',
                        cancelText: '取消',
                        onOk: () => {
                            deleteRole({ uuid: params.row.uuid }).then(res => {
                                if (res.data.success) {
                                    that.$Message.success('删除成功!')
                                    that.getTableList()
                                }
                            })
                        }
                    })
                }
            }
        }, '删除')
    }

    return [{
            title: '角色名称',
            key: 'name',
        },
        {
            title: '用户数',
            key: 'userCount',
        },
        {
            title: '更新时间',
            key: 'updatedOn'
        },
        {
            title: '更新人',
            key: 'updatedByUserName'
        },
        {
            title: '操作',
            key: 'operation',
            width: 150,
            render: (h, params) => {
                return h('div', [editBtn(h, params), deleteBtn(h, params)])
            }
        }
    ]
}



export const inputList = [{
    name: 'text-input', // 文本输入框名
    bind_key: 'name', // 返回数据的key名
    placeholder: '请输入角色',
    value: '', // 用于数据绑定
    title: '角色：', // 展示的字段名
    titleWidth: 50, // 展示的字段名的宽度
    inputWidth: 200,
    key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
    isHide: false // false: 不隐藏 / true: 隐藏
}, ]