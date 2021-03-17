export const billName = {
  0:'银联日对账',
  1:'支付宝日对账',
  2:'微信支付日对账',
  3:'网通日对账'
}

export const diffReason = {
  1:'red',
  2:'blue',
  3:'blue',
}

export const stateType = {
  0:'未开始',
  1:'平台长款',
  2:'平台短款',
  3:'平账',
}

const getDate = (timeStamp, startType) => {
  let times = timeStamp ? timeStamp.split(' ') : false;
  let resStr = '';
  if(times){
    if (startType === 'year') resStr = times[0]
    else resStr = times[1]
  }
  return resStr
}

const setColor = (type) => {
  let str = diffReason[type];
  return str
}

export const formDataPT = (that) => {
  return {
    total: 0,
    currPage: 1,
    pageSize: 20,
    columns: {
      ptBillId: {
        title: '订单编号',
        key: 'ptBillId',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptBillId)
        }
      },
      ptTradeDate: {
        title: '交易日期',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          let time = getDate(params.row.ptTradeDate,'year');
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },time)
        }
      },
      ptTradeTime: {
        title: '交易时间',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          let time = getDate(params.row.ptTradeTime);
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },time)
        }
      },
      ptOrderAmount: {
        title: '订单金额',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptOrderAmount)
        }
      },
      ptServiceCharge: {
        title: '手续费',
        key: '',
        align:"center",
        width: 100,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptServiceCharge)
        }
      },
      reconciliationDate: {
        title: '账单日',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.reconciliationDate)
        }
      },
      ptMerchantOrderId: {
        title: '银商订单号',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptMerchantOrderId)
        }
      },
      ptTerminalId: {
        title: '终端号',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptTerminalId)
        }
      },
      ptSettleAmount: {
        title: '清算金额',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptSettleAmount)
        }
      },
      ptTradeFlowId: {
        title: '流水号',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptTradeFlowId)
        }
      },
      ptTradeTypeId: {
        title: '交易类型',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptTradeTypeId)
        }
      },
      ptTradeType: {
        title: '交易类型',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptTradeType)
        }
      },
      ptReferenceId: {
        title: '参考号',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptReferenceId)
        }
      },
      ptBankcardId: {
        title: '平台参考号',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptBankcardId)
        }
      },
      ptBankcardTypeId: {
        title: '平台卡类型',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptBankcardTypeId)
        }
      },
      ptBankcardType: {
        title: '平台卡类型',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptBankcardType)
        }
      },
      ptPayTypeId: {
        title: '平台支付类型',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptPayTypeId)
        }
      },
      ptPayType: {
        title: '平台支付类型',
        key: '',
        align:"center",
        width: 110,
        render:(h,params) => {
          return h('span',{
            style:{
              color: setColor(params.row.diffReason)
            }
          },params.row.ptPayType)
        }
      },
    }
  }
}

export const formDataQD = (that) => {
  return {
    totalQD: 0,
    currPageQD: 1,
    pageSizeQD: 20,
    columnsQD:{}
  }
}

export const columnsYL = {
  merchantOrderId: {
    title: '商户订单号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.merchantOrderId)
    }
  },
  qdDate: {
    title: '交易日期',
    key: '',
    align:"center",
    width: 110,
    render:(h,params) => {
      let time = getDate(params.row.tradeTransmissionTime,'year');
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },time)
    }
  },
  qdTime: {
    title: '交易日期',
    key: '',
    align:"center",
    width: 110,
    render:(h,params) => {
      let time = getDate(params.row.tradeTransmissionTime);
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },time)
    }
  },
  tradeAmount: {
    title: '订单金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.tradeAmount)
    }
  },
  serviceCharge: {
    title: '手续费',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.serviceCharge)
    }
  },
  inquireTradeId: {
    title: '银商订单号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.inquireTradeId)
    }
  },
  tradeId: {
    title: '交易代码',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.tradeId)
    }
  },
  agencyId: {
    title: '代理机构标识码',
    key: '',
    align:"center",
    width: 130,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.agencyId)
    }
  },
  sendAgencyId: {
    title: '发送机构标识码',
    key: '',
    align:"center",
    width: 130,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.sendAgencyId)
    }
  },
  systemTrackId: {
    title: '系统跟踪号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.systemTrackId)
    }
  },
  accountId: {
    title: '账号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.accountId)
    }
  },
  merchantType: {
    title: '商户类别',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.merchantType)
    }
  },
  terminalType: {
    title: '终端类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.terminalType)
    }
  },
  payTypeOld: {
    title: '支付方式',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.payTypeOld)
    }
  },
  cardType: {
    title: '支付卡类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.cardType)
    }
  },
  oriTradeSystemTrackId: {
    title: '原始交易的系统跟踪号',
    key: '',
    align:"center",
    width: 160,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.oriTradeSystemTrackId)
    }
  },
  oriTradeTime: {
    title: '原始交易日期时间',
    key: '',
    align:"center",
    width: 140,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.oriTradeTime)
    }
  },
  settleOrderAmount: {
    title: '结算金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.settleOrderAmount)
    }
  },
  payTypeNew: {
    title: '支付方式',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.payTypeNew)
    }
  },
  groupMerchantId: {
    title: '集团商户代码',
    key: '',
    align:"center",
    width: 120,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.groupMerchantId)
    }
  },
  tradeType: {
    title: '交易类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.tradeType)
    }
  },
  subTradeType: {
    title: '交易子类',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.subTradeType)
    }
  },
  businessType: {
    title: '业务类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.businessType)
    }
  },
  accountType: {
    title: '账号类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.accountType)
    }
  },
  billType: {
    title: '账单类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.billType)
    }
  },
  billNo: {
    title: '账单号码',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.billNo)
    }
  },
  interactWay: {
    title: '交互方式',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.interactWay)
    }
  },
  oriInquireTradeId: {
    title: '原交易查询流水号',
    key: '',
    align:"center",
    width: 140,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.oriInquireTradeId)
    }
  },
  merchantId: {
    title: '商户代码',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.merchantId)
    }
  },
  ledgersType: {
    title: '分账入账方式',
    key: '',
    align:"center",
    width: 120,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.ledgersType)
    }
  },
  subMerchantId: {
    title: '二级商户代码',
    key: '',
    align:"center",
    width: 110,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.subMerchantId)
    }
  }
}

export const columnsZFB = {
  merchantOrderId: {
    title: '商户订单号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.merchantOrderId)
    }
  },
  createDate: {
    title: '交易日期',
    key: 'createTime',
    align:"center",
    width: 110,
    render:(h,params) => {
      let time = getDate(params.row.createTime,'year');
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },time)
    }
  },
  createTime: {
    title: '交易时间',
    key: 'createTime',
    align:"center",
    width: 110,
    render:(h,params) => {
      let time = getDate(params.row.createTime);
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },time)
    }
  },
  orderAmount: {
    title: '订单金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.orderAmount)
    }
  },
  serviceCharge: {
    title: '手续费',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.serviceCharge)
    }
  },
  alipayTradeId: {
    title: '银商订单号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.alipayTradeId)
    }
  },


  businessType: {
    title: '业务类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.businessType)
    }
  },

  commodityName: {
    title: '商品名称',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.commodityName)
    }
  },

  finishTime: {
    title: '完成时间',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.finishTime)
    }
  },

  storeId: {
    title: '门店编号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.storeId)
    }
  },
  storeName: {
    title: '门店名称',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.storeName)
    }
  },
  operaterId: {
    title: '操作员',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.operaterId)
    }
  },
  terminalId: {
    title: '终端号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.terminalId)
    }
  },
  reciprocalAccount: {
    title: '对方账户',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.reciprocalAccount)
    }
  },
  receiptAmount: {
    title: '商家实收',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.receiptAmount)
    }
  },
  alipayRedPacketAmount: {
    title: '支付宝红包',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.alipayRedPacketAmount)
    }
  },
  jfbAmount: {
    title: '集分宝',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.jfbAmount)
    }
  },
  alipayDiscountAmount: {
    title: '支付宝优惠',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.alipayDiscountAmount)
    }
  },
  ptPayTypeId: {
    title: '商家优惠',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.ptPayTypeId)
    }
  },
  couponCavAmout: {
    title: '券核销金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.couponCavAmout)
    }
  },
  couponName: {
    title: '券名称',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.couponName)
    }
  },
  merchantRedPacketAmount: {
    title: '商家红包消费金额',
    key: '',
    align:"center",
    width: 150,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.merchantRedPacketAmount)
    }
  },
  cardConsumeAmount: {
    title: '卡消费金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.cardConsumeAmount)
    }
  },
  refundId: {
    title: '退款批次号/请求号',
    key: '',
    align:"center",
    width: 160,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.refundId)
    }
  },
  profitAmout: {
    title: '分润',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.profitAmout)
    }
  },
  command: {
    title: '备注',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.command)
    }
  },
  ds: {
    title: '分区',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.ds)
    }
  }
}

export const columnsWX = {
  merchantOrderId: {
    title: '商户订单号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.merchantOrderId)
    }
  },
  tradeDate: {
    title: '交易日期',
    key: '',
    align:"center",
    width: 110,
    render:(h,params) => {
      let time = getDate(params.row.tradeTime,'year');
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },time)
    }
  },
  tradeTime: {
    title: '交易时间',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      let time = getDate(params.row.tradeTime);
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },time)
    }
  },
  orderAmount: {
    title: '订单金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.orderAmount)
    }
  },
  serviceCharge: {
    title: '手续费',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.serviceCharge)
    }
  },
  wechatOrderId: {
    title: '银商订单号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.wechatOrderId)
    }
  },
  commonAccountId: {
    title: '公众账号ID',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.commonAccountId)
    }
  },
  merchantId: {
    title: '商户号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.merchantId)
    }
  },
  specialMerchantId: {
    title: '特约商户号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.specialMerchantId)
    }
  },
  deviceIt: {
    title: '设备号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.deviceIt)
    }
  },
  userFlag: {
    title: '用户标识',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.userFlag)
    }
  },
  tradeType: {
    title: '交易类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.tradeType)
    }
  },
  tradeStatus: {
    title: '交易状态',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.tradeStatus)
    }
  },
  payBank: {
    title: '付款银行',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.payBank)
    }
  },
  currency: {
    title: '货币种类',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.currency)
    }
  },
  settleOrderAmount: {
    title: '应结订单金额',
    key: '',
    align:"center",
    width: 120,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.settleOrderAmount)
    }
  },
  couponAmount: {
    title: '代金券金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.couponAmount)
    }
  },
  commodityName: {
    title: '商品名称',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.commodityName)
    }
  },
  merchantDataPackage: {
    title: '商户数据包',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.merchantDataPackage)
    }
  },
  serviceChargeRate: {
    title: '费率',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.serviceChargeRate)
    }
  },
  serviceChargeRateCommand: {
    title: '费率备注',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.serviceChargeRateCommand)
    }
  },
  ds: {
    title: '分区',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.ds)
    }
  }
}

export const columnsWT = {
  qdBillId: {
    title: '商户订单号',
    key: '',
    align:"center",
    width: 110,
    render:(h,params) => {
      let txt = params.row.h5MerchantOrderId ? params.row.h5MerchantOrderId : params.row.fsMerchantFlowId;
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },txt)
    }
  },
  qdDate: {
    title: '交易日期',
    key: '',
    align:"center",
    width: 110,
    render:(h,params) => {
      let time = params.row.h5TradeDate ? params.row.h5TradeDate : params.row.fsMerchantDate;
      time = getDate(time,'year');
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },time)
    }
  },
  qdTime: {
    title: '交易时间',
    key: 'TradeTime',
    align:"center",
    width: 110,
    render:(h,params) => {
      let time = params.row.h5TradeDate ? params.row.h5TradeTime : '';
      time = getDate(time);
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },time)
    }
  },
  qdOrderAmount: {
    title: '订单金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      let txt = params.row.qdOrderAmount ? params.row.qdOrderAmount : params.row.fsTradeAmount;
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },txt)
    }
  },
  h5ServiceCharge: {
    title: '手续费',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5ServiceCharge)
    }
  },
  qdTardeFlowId: {
    title: '银商订单号',
    key: '',
    align:"center",
    width: 110,
    render:(h,params) => {
      let txt = params.row.h5TardeFlowId ? params.row.h5TardeFlowId : params.row.fsBankFlowId;
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },txt)
    }
  },
  h5MerchantBbkId: {
    title: '商户分行号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5MerchantBbkId)
    }
  },
  h5MerchantId: {
    title: '商户号',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5MerchantId)
    }
  },
  h5MerchantOrderDate: {
    title: '商户订单日期',
    key: '',
    align:"center",
    width: 130,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5MerchantOrderDate)
    }
  },
  h5Currency: {
    title: '交易币种',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5Currency)
    }
  },
  h5TardeType: {
    title: '交易类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5TardeType)
    }
  },
  h5SettleAmount: {
    title: '结算金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5SettleAmount)
    }
  },
  h5CouponAmount: {
    title: '优惠金额',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5CouponAmount)
    }
  },
  h5SettleDate: {
    title: '结算日期',
    key: '',
    align:"center",
    width: 130,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5SettleDate)
    }
  },
  h5SettleTime: {
    title: '结算时间',
    key: '',
    align:"center",
    width: 160,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5SettleTime)
    }
  },
  h5BankcardType: {
    title: '卡类型',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5BankcardType)
    }
  },
  h5MerchantCustomField: {
    title: '商户自定义参数',
    key: '',
    align:"center",
    width: 130,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.h5MerchantCustomField)
    }
  },
  fsBankAccountId: {
    title: '免密银行账号',
    key: '',
    align:"center",
    width: 130,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.fsBankAccountId)
    }
  },
  fsClientContractId: {
    title: '免密客户协议号',
    key: '',
    align:"center",
    width: 130,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.fsClientContractId)
    }
  },
  fsTradeId: {
    title: '免密交易码',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.fsTradeId)
    }
  },
  fsCurrency: {
    title: '免密币种',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.fsCurrency)
    }
  },
  fsTradeStatus: {
    title: '免密交易状态',
    key: '',
    align:"center",
    width: 130,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.fsTradeStatus)
    }
  },
  ds: {
    title: '分区',
    key: '',
    align:"center",
    width: 100,
    render:(h,params) => {
      return h('span',{
        style:{
          color: setColor(params.row.diffReason)
        }
      },params.row.ds)
    }
  }
}

