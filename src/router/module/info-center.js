import Main from '@/components/main'

export default {
  path: '/messageCenter',
  name: 'messageCenter',
  component: Main,
  meta: {
    icon: 'ios-mail',
    title: '消息管理',
    showAlways: true
  },
  children: [
    {
      path: 'shortmessage-manage',
      name: 'shortmessage-manage',
      meta: {
        title: '短信管理'
      },
      component: () => import('@/view/single-page/shortmessagemanage-moules/short-message/index.vue')
    },
    {
      path: 'shortmessage-IM',
      name: 'shortmessage-IM',
      meta: {
        title: 'IM消息管理'
      },
      component: () => import('@/view/single-page/shortmessagemanage-moules/IM/index.vue')
    },
    {
      path: 'vechile-voice',
      name: 'vechile-voice',
      meta: {
        title: '车机语音管理'
      },
      component: () => import('@/view/single-page/shortmessagemanage-moules/vechile-voice/index.vue')
    },
    {
      path: 'push-center',
      name: 'push-center',
      meta: {
        title: 'push管理'
      },
      component: () => import('@/view/single-page/shortmessagemanage-moules/push-management/index.vue')
    },
    {
      path: 'add-push',
      name: 'add-push',
      meta: {
        title: '新增push',
        hideInMenu: true,
        parentName: 'push-center'
      },
      component: () => import('@/view/single-page/shortmessagemanage-moules/push-management/add.vue')
    },
    {
      path: 'announcement-center',
      name: 'announcement-center',
      meta: {
        title: '公告管理'
      },
      component: () => import('@/view/single-page/shortmessagemanage-moules/announcement/index.vue')
    },
    {
      path: 'announcement-add',
      name: 'announcement-add',
      meta: {
        title: '添加公告',
        hideInMenu: true,
        parentName: 'announcement-center'
      },
      component: () => import('@/view/single-page/shortmessagemanage-moules/announcement/add.vue')
    }
  ]
}
    