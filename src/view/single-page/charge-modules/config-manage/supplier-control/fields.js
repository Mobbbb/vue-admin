import { axiosSwitchSupplier } from "@/api/charge.js";
// table数据
export const returnFields = (that) => {
  return {
    index: {
      title: '序号',
      type: 'index',
      width: 60,
      align: 'center'
    },
    supplierId: {
      title: '供应商代码',
      key: 'supplierId',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    supplierName: {
      title: '供应商名称',
      key: 'supplierName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    brandName: {
      title: '品牌',
      key: 'brandName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    contact: {
      title: '联系人',
      key: 'contact',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    phone: {
      title: '联系电话',
      key: 'phone',
      ellipsis: true,
      tooltip: true,
      minWidth: 120
    },
    action: {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "warning",
              ghost: true,
              size: "small"
            },
            'class': {
              tableBtn: true
            },
            directives: [{
              name: 'hasAuth',
              value: 'supplier-control-edit'
            }],
            on: {
              click: () => {
                let addparams = that.addparams
                let paramsrow = params.row

                for (let key in addparams) {
                  addparams[key] = paramsrow[key]
                }
                addparams.uuid = paramsrow.uuid

                that.addparams = addparams
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
            'class': {
              tableBtn: true
            },
            /*directives: [{
              name: 'hasAuth',
              value: 'supplier-control-detail'
            }],*/
            style: {
              display: Number(params.row.status) === 1 ? 'inline-block' : 'none'
            },
            on: {
              click: () => {
                that.$router.push('/chargeCenter/charge-station?id=' + params.row.supplierId);
              }
            }
          }, '详情'),
          h('Button', {
            props: {
              type: Number(params.row.status) === 1 ? 'error' : 'success',
              ghost: true,
              size: "small"
            },
            directives: [{
              name: 'hasAuth',
              value: 'supplier-control-switch'
            }],
            on: {
              click: () => {
                that.$Modal.confirm({
                  title: Number(params.row.status) === 1 ? '确认停用此供应商' : '确认启用此供应商',
                  content: `<div>供应商代码：${params.row.supplierId}</div><div>供应商名称：${params.row.supplierName}</div>`,
                  onOk: () => {
                    let param = {
                      uuid: params.row.uuid,
                      status: Number(params.row.status) === 1 ? 0 : 1
                    }
                    axiosSwitchSupplier(param).then(res => {
                      if (res.data.success) {
                        that.$Message.success(res.data.msg);
                        that.getList(true)
                      } else {
                        that.$Message.error(res.data.msg);
                      }
                    })
                  }
                })
              }
            }
          }, Number(params.row.status) === 1 ? '停用' : '启用')
        ])
      }
    }
  }
}

// 表单验证
export const addparamsRule = {
  //新增参数验证
  supplierId: [
    { required: true, message: "供应商代码不能为空", trigger: "blur" }
  ], // 供应商代码
  supplierName: [
    { required: true, message: "供应商名称不能为空", trigger: "blur" }
  ], // 供应商名称
  brandName: [
    { required: true, message: "品牌不能为空", trigger: "blur" }
  ], // 品牌
  contact: [
    { required: true, message: "联系人不能为空", trigger: "blur" }
  ], // 联系人
  phone: [
    { required: true, message: "联系人电话不能为空", trigger: "blur" },
    {
      pattern: /^1[34578]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ] // 联系人电话
}