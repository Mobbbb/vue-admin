/* 公共服务-会员服务-账号基本信息 */
export const returnFields = (that) => {
  return {
    idxs: {
      title: '序号',
      key: 'idxs',
      ellipsis: true,
      tooltip: true,
      width: 70
    },
    uuid: {
      title: '协议ID',
      key: 'uuid',
      ellipsis: true,
      tooltip: true,
      minWidth: 270
    },
    protocolName: {
      title: '协议名称',
      key: 'protocolName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    protocolVersion: {
      title: '协议版本',
      key: 'protocolVersion',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    updateRule: {
      title: '更新机制(强制更新)',
      key: 'updateRule',
      ellipsis: true,
      tooltip: true,
      minWidth: 190,
      render: (h, params) => {
        let titles = params.row.updateRule == 1 ?'是':params.row.updateRule == 0?'否': '暂无'
        return h('div', titles)
      }
    },
    protocolLink: {
      title: '资源地址',
      key: 'protocolLink',
      ellipsis: true,
      tooltip: true,
      minWidth: 220
    },
    updatedOn: {
      title: '更新时间',
      key: 'updateTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 220
    },
    updatedBy: {
      title: '最后更新人',
      key: 'updater',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 140,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "warning",
              ghost: true,
              size: "small"
            },
            'class':{
                tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'agreement_control-edit'
            }],
            on: {
              click: () => {
                let addparams = that.addparams
                let paramsrow = params.row
                let uuid = paramsrow.uuid
                for (let key in addparams) {
                  addparams[key] = paramsrow[key]
                }
                addparams['protocolName'] = addparams.protocolName == '乘客端' ? '1' : '2'
                addparams.updateRule = params.row.updateRule == 1 ?true:false
                addparams.uuid = uuid
                that.controlbtn = {
                  savebtn: false,
                  updatebtn: true
                }
                if (!addparams.protocolLink) {
                  addparams.protocolLink = '暂无'
                }
                that.addparams = addparams
                that.modaltitle = '编辑'
                that.editorModal = true
                that.newMobel = true
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
              value: 'agreement_control-detail'
            }],
            on: {
              click: () => {
                that.lookMobel = true
                that.protocolLink = params.row.protocolLink
              }
            }
          }, '查看')
        ])
      }
    }
  }
}
