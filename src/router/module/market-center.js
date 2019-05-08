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
      path: 'activity',
      name: 'activity',
      meta: {
        title: '营销活动'
      },
      component: () => import('@/view/single-page/marketing-moules/activity/index.vue')
    },
    {
      path: 'activity-register/:id',
      name: 'activity-register',
      meta: {
        title: '注册活动',
        hideInMenu: true
      },
      component: () => import('@/view/single-page/marketing-moules/activity/register.vue')
    },
    {
      path: 'activity-registration-record',
      name: 'activity-registration-record',
      meta: {
        title: '注册记录',
        hideInMenu: true
      },
      component: () => import('@/view/single-page/marketing-moules/activity/registration-record.vue')
    },
    {
      path: 'activity-passenger/:id',
      name: 'activity-passenger',
      meta: {
        title: '乘客奖励',
        hideInMenu: true
      },
      component: () => import('@/view/single-page/marketing-moules/activity/passenger-reward.vue')
    },
    {
      path: 'activity-driver/:id',
      name: 'activity-driver',
      meta: {
        title: '司机奖励',
        hideInMenu: true
      },
      component: () => import('@/view/single-page/marketing-moules/activity/driver-reward.vue')
    },
    {
      path: 'activity-invite-record',
      name: 'activity-invite-record',
      meta: {
        title: '邀请记录',
        hideInMenu: true
      },
      component: () => import('@/view/single-page/marketing-moules/activity/invite-record.vue')
    },
    {
      path: 'activity-recharge/:id',
      name: 'activity-recharge',
      meta: {
        title: '充值活动',
        hideInMenu: true
      },
      component: () => import('@/view/single-page/marketing-moules/activity/recharge.vue')
    },
    {
      path: 'activity-recharge-record',
      name: 'activity-recharge-record',
      meta: {
        title: '充值记录',
        hideInMenu: true
      },
      component: () => import('@/view/single-page/marketing-moules/activity/recharge-record.vue')
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
        // icon: 'md-star',
        title: '优惠券模板管理'
      },
      component: () => import('@/view/single-page/marketing-moules/coupons-template/index.vue')
    },
    {
      path: 'coupons-template-detail/:id',
      name: 'coupons-template-detail',
      meta: {
        // icon: 'md-star',
        hideInMenu: true,
        title: '优惠券模板管理详情'
      },
      component: () => import('@/view/single-page/marketing-moules/coupons-template/detail.vue')
    },
    {
      path: 'once-coupons',
      name: 'once-coupons',
      meta: {
        // icon: 'md-star',
        title: '一次性发券'
      },
      component: () => import('@/view/single-page/marketing-moules/coupons-template/once-coupons.vue')
    },
    {
      path: 'once-couponsRecord',
      name: 'once-couponsRecord',
      meta: {
        // icon: 'md-star',
        title: '一次性发券记录'
      },
      component: () => import('@/view/single-page/marketing-moules/coupons-template/once-couponsRecord.vue')
    },
    {
      path: 'coupons',
      name: 'coupons',
      meta: {
        // icon: 'md-star',
        title: '优惠券'
      },
      component: () => import('@/view/single-page/marketing-moules/coupons/index.vue')
    },
    {
      path: 'coupons-detail/:id',
      name: 'coupons-detail',
      meta: {
        // icon: 'md-star',
        title: '优惠券详情'
      },
      component: () => import('@/view/single-page/marketing-moules/coupons/detail.vue')
    },
  ]
}