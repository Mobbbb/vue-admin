import { deleteUser, updateStatus, resetPassword } from '@/api/power-data'

/* 基础管理-权限管理-用户管理 */
export const returnFields = (that) => {
    let editBtn = (h, params) => {
        return h('Button', {
            props: {
              type: "warning",
              ghost: true,
              size: "small"
            },
            style:{
                marginRight: '15px',
                display: that.$utils.pkAccess('user_control_edit') === true ? 'inline-block' : 'none'
            },
            on: {
                click: () => {
                    that.popView = true
                    that.title = '编辑用户'
                    that.params = {
                      uuid: params.row.uuid,
                      userAccount: params.row.userAccount,
                      userName: params.row.userName,
                      userMobile: params.row.userMobile,
                      userRole: params.row.userRoleList,
                      groupName: params.row.groupName,
                      userGroupId: params.row.userGroupId,
                      type: 'edit'
                    }
                }
            }
        }, '编辑')
    }
    let deleteBtn = (h, params) => {
        return ''/*h('Button', {
            props: {
              type: "error",
              ghost: true,
              size: "small"
            },
            style:{
                marginRight: '15px',
                display: that.$utils.pkAccess('user_control_delete') === true ? 'inline-block' : 'none'
            },
            on: {
                click: () => {
                  that.$Modal.confirm({
                      title: '提示',
                      content: '<p>确定要删除吗？</p>',
                      cancelText: '取消',
                      onOk: () => {
                          deleteUser({ uuid: params.row.uuid }).then(res => {
                              if(res.data.success){
                                  that.$Message.success('删除成功!')
                                  that.getTableList()
                              }
                          })
                      }
                  }) 
                }
            }
        }, '删除')*/
    }
    let freezeBtn = (h, params) => {
        return h('a', {
            style: {
                display: that.$utils.pkAccess('user_control_edit') === true ? 'block' : 'none',
                marginTop: '5px',
                padding: '0 5px',
                color: '#4A4A4A'
            },
            on: {
                click: () => {
                    let text = ''
                    let status = '1'
                    if(params.row.status === '1') {
                      status = '2'
                      text = '冻结'
                    } else {
                      status = '1'
                      text = '解冻'
                    }
                    let data = {
                        uuid: params.row.uuid,
                        userAccount: params.row.userAccount,
                        status: status
                    }
                    that.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要'+ text +'吗？</p>',
                        cancelText: '取消',
                        onOk: () => {
                            updateStatus(data).then(res => {
                                if(res.data.success){
                                    that.$Message.success(text + '成功!')
                                    that.getTableList()
                                }
                            })
                        }
                    })
                }
            }
        },'冻结/解冻')
    }
    let resetBtn = (h, params) => {
        return h('a', {
            style: {
                display: that.$utils.pkAccess('user_control_edit') === true ? 'block' : 'none',
                margin: '5px 0 5px 0',
                color: '#4A4A4A'
            },
            on: {
                click: () => {
                    that.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要重置密码吗？</p>',
                        cancelText: '取消',
                        onOk: () => {
                            resetPassword(params.row).then(res => {
                                if(res.data.success){
                                    that.$Message.success('密码重置成功!')
                                    that.getTableList()
                                }
                            })
                        }
                    })
                }
            }
        },'密码重置')
    }
    let moreBtn = (h, params) => {
      let moreFlag = that.$utils.pkAccess('user_control_freeze') || that.$utils.pkAccess('user_control_reset')
        return h('Dropdown',{
            props: {
                transfer: true
            }
        },[
            h('Button',{
                props: {
                  type: "primary",
                  ghost: true,
                  size: "small"
                },
                style:{
                  marginRight: '15px',
                  display: moreFlag === true ? 'inline-block' : 'none'
                }, 
            },'更多'),
            h('DropdownMenu', {
                slot: 'list',
                style: {
                    minWidth: '60px',
                    textAlign: 'center'
                }
            },[freezeBtn(h, params), resetBtn(h, params)])
        ])
    }

    return {
        userAccount: {
            title: '用户账号',
            key: 'userAccount',
            tooltip: true,
            minWidth: 100
        },
        userName: {
            title: '用户姓名',
            key: 'userName',
            tooltip: true,
            minWidth: 100
        },
        userMobile: {
            title: '手机号',
            key: 'userMobile',
            tooltip: true,
            minWidth: 100
        },
        groupName: {
            title: '所属分组',
            key: 'groupName',
            tooltip: true,
            minWidth: 100
        },
        roleName: {
            title: '角色',
            key: 'roleName',
            tooltip: true,
            minWidth: 100
        },
        createdTimeStr: {
            title: '创建时间',
            key: 'createdTimeStr',
            sortable: true,
            tooltip: true,
            minWidth: 120
        },
        status: {
            title: '状态',
            key: 'status',
            minWidth: 70,
            render: (h, params) => {
                if(params.row.status === '1') return h('div', '正常')
                else return h('div', '冻结')
            }
        },
        action: {
            title:'操作',
            key:'action',
            width: 150,
            render: (h, params) => {
                return h('div', [editBtn(h, params), deleteBtn(h, params), moreBtn(h, params)])
            }
        }
    }
}

export const inputList = [
    {
      name: 'text-input', // 文本输入框名
      bind_key: 'userAccount', // 返回数据的key名
      placeholder: '请输入用户名',
      value: '', // 用于数据绑定
      title: '用户账号：', // 展示的字段名
      titleWidth: 65, // 展示的字段名的宽度
      inputWidth: 200, // input框的宽度
      key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
      isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
      name: 'remote-input', // 远程输入框
      bind_key: 'userName', // 返回数据的key名
      placeholder: '请输入姓名',
      value: '', // 用于数据绑定
      title: '姓名：', // 展示的字段名
      titleWidth: 65, // 展示的字段名的宽度
      inputWidth: 200, // input框的宽度
      remoteMethod: {}, // 远程输入框输入时触发方法
      remoteList: [], // 远程输入框匹配到的列表
      key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
      isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
      name: 'text-input', // 文本输入框名
      bind_key: 'userMobile', // 返回数据的key名
      placeholder: '请输入手机号',
      value: '', // 用于数据绑定
      title: '手机号：', // 展示的字段名
      titleWidth: 65, // 展示的字段名的宽度
      inputWidth: 200, // input框的宽度
      key: '1', // 该文本框的唯一标识，用于匹配该文本框是否展示
      isHide: false // false: 不隐藏 / true: 隐藏
    },
    {
      name: 'drop-input', // 下拉选择框
      bind_key: 'userRole',
      placeholder: '请选择角色',
      value: '',
      title: '角色：',
      titleWidth: 65,
      inputWidth: 200, // input框的宽度
      dropList: [],
      key: '5',
      isHide: false
    },
    {
      name: 'drop-input', // 下拉选择框
      bind_key: 'status',
      placeholder: '请选择状态',
      value: '',
      title: '状态：',
      titleWidth: 65,
      inputWidth: 200, // input框的宽度
      dropList: [ // 下拉选择框选项
        {
          label: '正常', // 展示的文字
          value: '1' // 选中后返回的数据
        },
        {
          label: '冻结',
          value: '2'
        }
      ],
      key: '5',
      isHide: false
    },
    {
      name: 'drop-tree-input', // 文本输入框名
      bind_key: 'groupId', // 返回数据的key名
      placeholder: '请选择分组',
      value: '', // 绑定返回数据
      label: '', // 绑定展示数据
      loading: true, // 树形加载中
      treeData: [], // 树形列表
      title: '所属分组：', // 展示的字段名
      titleWidth: 65, // 展示的字段名的宽度
      inputWidth: 200, // input框的宽度
      key: '666', // 该文本框的唯一标识，用于匹配该文本框是否展示
      isHide: false // false: 不隐藏 / true: 隐藏
    }
    /*
    {
      name: 'time-input', // 时间选择(日期+时分秒)
      bind_key: 'enabledDate',
      placeholder: '请选择时间',
      value: '',
      title: '启用时间：',
      titleWidth: 65,
      inputWidth: 200, // input框的宽度
      key: '6',
      isHide: false
    }
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
    }
    */
]