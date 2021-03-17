import Main from '@/components/main'

export default {
  path: '/marketing',
  name: 'marketing',
  component: Main,
  meta: {
    icon: 'md-bowtie',
    title: '营销管理',
    showAlways: true
  },
  children: [
    {
      path: 'activity-manage',
      name: 'activity-manage',
      meta: {
        title: '活动管理'
      },
      component: () => import('@/view/single-page/marketing-moules/activity-manage/index.vue')
    },
    {
      path: 'new-activity/:id?',
      name: 'new-activity',
      meta: {
        title: '新建活动',
        hideInMenu: true,
        closeAlert: true // 关闭/切换导航时弹出二次确认框
      },
      component: () => import('@/view/single-page/marketing-moules/activity-manage/new-activity/index.vue')
    },
    {
      path: 'activity-detail/:id',
      name: 'activity-detail',
      meta: {
        title: '活动详情'
      },
      component: () => import('@/view/single-page/marketing-moules/activity-manage/activity-detail/index.vue')
    },
    {
      path: 'advertising',
      name: 'advertising',
      meta: {
        title: 'APP广告位'
      },
      component: () => import('@/view/single-page/marketing-moules/advertising/index.vue')
    },
    {
      path: 'advertising-advertisingPage/:id',
      name: 'advertising-advertisingPage',
      meta: {
        title: '广告页'
      },
      component: () => import('@/view/single-page/marketing-moules/advertising/advertisingPage.vue')
    },
    {
      path: 'advertising-expressWindow/:id',
      name: 'advertising-expressWindow',
      meta: {
        title: '快车弹窗'
      },
      component: () => import('@/view/single-page/marketing-moules/advertising/expressWindow.vue')
    },
    {
      path: 'advertising-tailoredCarWindow/:id',
      name: 'advertising-tailoredCarWindow',
      meta: {
        title: '专车弹窗'
      },
      component: () => import('@/view/single-page/marketing-moules/advertising/tailoredCarWindow.vue')
    },
    {
      path: 'advertising-taxiWindow/:id',
      name: 'advertising-taxiWindow',
      meta: {
        title: '出租车弹窗'
      },
      component: () => import('@/view/single-page/marketing-moules/advertising/taxiWindow.vue')
    },
    {
      path: 'coupons-template',
      name: 'coupons-template',
      meta: {
        title: '券模板管理'
      },
      component: () => import('@/view/single-page/marketing-moules/coupons-template/index.vue')
    },
    {
      path: 'coupons-template-detail',
      name: 'coupons-template-detail',
      meta: {
        hideInMenu: true,
        parentName: 'coupons-template',
        title: '券模板详情'
      },
      component: () => import('@/view/single-page/marketing-moules/coupons-template/template-detail.vue')
    },
    {
      path: 'add-coupons-template',
      name: 'add-coupons-template',
      meta: {
        hideInMenu: true,
        parentName: 'coupons-template',
        title: '新建券模板'
      },
      component: () => import('@/view/single-page/marketing-moules/coupons-template/add-template.vue')
    },
    {
      path: 'user-group',
      name: 'user-group',
      meta: {
        title: '用户群管理'
      },
      component: () => import('@/view/single-page/marketing-moules/user-group/index.vue')
    },
    {
      path: 'add-user-group',
      name: 'add-user-group',
      meta: {
        title: '新建用户群',
        hideInMenu: true,
        parentName: 'user-group',
        closeAlert: true // 关闭/切换导航时弹出二次确认框
      },
      component: () => import('@/view/single-page/marketing-moules/user-group/operation/add.vue')
    },
    {
      path: 'edit-user-group',
      name: 'edit-user-group',
      meta: {
        title: '编辑用户群',
        hideInMenu: true,
        parentName: 'user-group',
        closeAlert: true // 关闭/切换导航时弹出二次确认框
      },
      component: () => import('@/view/single-page/marketing-moules/user-group/operation/edit.vue')
    },
    {
      path: 'detail-user-group',
      name: 'detail-user-group',
      meta: {
        title: '用户群详情',
        hideInMenu: true,
        parentName: 'user-group'
      },
      component: () => import('@/view/single-page/marketing-moules/user-group/operation/detail.vue')
    }
  ]
}