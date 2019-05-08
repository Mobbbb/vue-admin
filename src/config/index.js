export default {
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description
     * 是否使用国际化，默认为false
     * 如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     * 用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        //dev: 'http://47.111.62.215:20901', // 开发环境
        dev: 'http://47.111.32.94:20904', // 测试环境
        pro: 'http://47.111.62.215:20901', // 开发环境
    },
    version: {
        dev: 'v0.9.13',
        pro: 'v0.9.13'
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
    /**
     * @description 需要加载的插件
     */
    plugin: {
        'error-store': {
            showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
            developmentOff: false // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    },
    /**
     * @description 导航标签、菜单、按钮存储key名
     */
    tagStorageKey: 'navList-admin',
    menuStorageKey: 'menuList-admin',
    btnStorageKey: 'btnList-admin',
}