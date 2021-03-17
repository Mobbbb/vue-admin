import Main from '@/components/main'
import parentView from '@/components/parent-view'
export default {
    path: '/companyCenter',
    name: 'companyCenter',
    component: Main,
    meta: {
        icon: "ios-thumbs-up", 
        title:'企业用车', 
        showAlways:true,
    },
    children: [
        {
            path: 'companyManageConfig',
            name: 'companyManageConfig',
            meta: {
                title: '企业管理',
                showAlways: true,
            },
            component: parentView,
            children: [{
                path: 'companyAuditManage',
                name: 'companyAuditManage',
                meta: {
                    title: '审核管理'
                },
                component: () =>
                    import ('@/view/single-page/company-modules/company-manage/audit-manage/index.vue')
            }, {
                path: 'companyInfoManage',
                name: 'companyInfoManage',
                meta: {
                    title: '企业信息'
                },
                component: () =>
                    import ('@/view/single-page/company-modules/company-manage/info-manage/index.vue')
            }, 
            {
                path: 'addCompany',
                name: 'addCompany',
                meta: {
                  title: '新增企业',
                  hideInMenu: true,
                  parentName: 'companyInfoManage'
                },
                component: () => 
                    import ('@/view/single-page/company-modules/company-manage/info-manage/addCompany.vue')
            },
            {
                path: 'editCompany/:uuid',
                name: 'editCompany',
                meta: {
                  title: '编辑企业',
                  hideInMenu: true,
                  parentName: 'companyInfoManage'
                },
                component: () => 
                    import ('@/view/single-page/company-modules/company-manage/info-manage/editCompany.vue')
            },
            {
                path: 'companyPeopleManage',
                name: 'companyPeopleManage',
                meta: {
                    title: '员工信息'
                },
                component: () =>
                    import ('@/view/single-page/company-modules/company-manage/people-manage/index.vue')
            }, {
                path: 'companyCarManage',
                name: 'companyCarManage',
                meta: {
                    title: '企业用车场景'
                },
                component: () =>
                    import ('@/view/single-page/company-modules/company-manage/car-manage/index.vue')
            }]
        },
        {
            path: 'companyCenterConfig',
            name: 'companyCenterConfig',
            meta: {
                title: '配置管理',
                showAlways: true,
            },
            component: parentView,
            children: [
                {
                    path: 'openManage',
                    name: 'companyOpenManage',
                    meta: {
                      title: '开通管理'
                    },
                    component: () => import('@/view/single-page/company-modules/config-control/open-manage/index.vue')
                },
                {
                    path: 'priceManage',
                    name: 'companyPriceManage',
                    meta: {
                      title: '定价管理'
                    },
                    component: () => import('@/view/single-page/company-modules/config-control/price-manage/index.vue')
                }
                // {
                //     path: 'useCarManage',
                //     name: 'companyUseCarManage',
                //     meta: {
                //       title: '用车场景管理'
                //     },
                //     component: () => import('@/view/single-page/company-modules/config-control/use-car-manage/index.vue')
                // }
            ]
        },
        {
            path: 'financialManage',
            name: 'financialManage',
            meta: {
                title: '财务结算'
            },
            component: () => 
                import('@/view/single-page/company-modules/financial-manage/index.vue')
        },
        {
            path: 'receiptManage',
            name: 'receiptManage',
            meta: {
                title: '发票管理'
            },
            component: () => 
                import('@/view/single-page/company-modules/receipt-manage/index.vue')
        },
        {
            path: 'financialManage/allCompanyBill/:id',
            name: 'allCompanyBill',
            meta: {
              title: '全部账单',
              hideInMenu: true,
              parentName: 'financialManage'
            },
            component: () => 
                import('@/view/single-page/company-modules/financial-manage/allBill.vue')
        },
        {
            path: 'financialManage/billCompanyDetail/:id',
            name: 'billCompanyDetail',
            meta: {
              title: '账单明细',
              hideInMenu: true,
              parentName: 'financialManage'
            },
            component: () => 
                import('@/view/single-page/company-modules/financial-manage/billDetail.vue')
        },
        {   
            path: 'orderManager',
            name: 'orderManager',
            meta: {
              title: '订单管理',
              showAlways:true,
            },
            component: parentView,
            children: [
                {
                    path: 'requirementSheetInfo',
                    name: 'requirementSheetInfo',
                    meta: {
                      title: '申请单信息'
                    },
                    component: () => import('@/view/single-page/company-modules/order-manager/requirement-info/index.vue')
                },
                {
                    path: 'orderInfo',
                    name: 'orderInfo',
                    meta: {
                      title: '订单信息'
                    },
                    component: () => import('@/view/single-page/company-modules/order-manager/order-info/index.vue')
                },
                {
                    path: 'demandorder-detail/:id',
                    name: 'demandorder-detail',
                    meta: {
                      title: '申请单详情',
                      hideInMenu: true,
                      parentName: 'requirementSheetInfo'
                    },
                    component: () => import('@/view/single-page/company-modules/order-manager/requirement-info/detail.vue')
                },
                {
                    path: 'orderdetail',
                    name: 'orderdetail',
                    meta: {
                      title: '订单详情',
                      hideInMenu: true,
                      parentName: 'requirementSheetInfo'
                    },
                    component: () => import('@/view/single-page/company-modules/order-manager/order-info/detail/detail.vue')
                }
            ]
        },
        {
            path: 'dispatchingCarsManager',
            name: 'dispatchingCarsManager',
            meta: {
              title: '派车管理'
            },
            component: () => import('@/view/single-page/company-modules/dispatchcars-manager/index.vue')
        },
        {
            path: 'corporateWallet',
            name: 'corporateWallet',
            meta: {
              title: '企业钱包'
            },
            component: () => import('@/view/single-page/company-modules/corporate-wallet/index.vue')
        },
        {
            path: '/corporateWallet/creditgranting/:id',
            name: 'creditgranting',
            meta: {
              title: '授信管理',
              hideInMenu: true
            },
            component: () => import('@/view/single-page/company-modules/corporate-wallet/opations/creditgranting.vue')
        },
        {
            path: '/corporateWallet/walletGrant/:id',
            name: 'walletGrant',
            meta: {
              title: '赠款管理',
              hideInMenu: true
            },
            component: () => import('@/view/single-page/company-modules/corporate-wallet/opations/grant.vue')
        },
        {
            path: '/corporateWallet/walletRefund/:id',
            name: 'walletRefund',
            meta: {
              title: '退款试算',
              hideInMenu: true,
            },
            component: () => import('@/view/single-page/company-modules/corporate-wallet/opations/refund.vue')
        },
        {
            path: '/corporateWallet/walletRecharge/:id',
            name: 'walletRecharge',
            meta: {
              title: '充值记录',
              hideInMenu: true,
            },
            component: () => import('@/view/single-page/company-modules/corporate-wallet/opations/rechargerecord.vue')
        }
    ]
}