import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import router from '../router/index'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'
import { Message, Notice } from 'iview';
let $Message = Message;
let $Notice = Notice;

export const messageMap = { // 所有响应返回的信息
    // 4100: '用户不存在',
    // 4101: '该手机号未注册',
    // 4102: '参数不正确',
    // 4103: '没有权限',
    // 4104: '验证码已超时',
    // 4105: '验证码不正确',
    // 4106: '该账号已冻结',
    // 4107: '账号无效', 
    // 4108: '密码不正确',
    4012: true, // 过期
    4117: true, // 认证过期
    4018: true, // 在其他终端登录
    // 9999: '登录过期，请重新登录',
    // 9998: '人员信息不存在',
    // 4016: '未授权'
}
export const TOKEN_KEY = 'operation_token'

export const setInputLists = (inputLists, showLists) => { // 将选择的input的isHide置为false(不隐藏)
  let returnList = JSON.parse(JSON.stringify(inputLists))
  if (showLists.length !== 0) {
    for (let i = 0; i < returnList.length; i++) {
      for (let j = 0; j < showLists.length; j++) {
        if (returnList[i].key === showLists[j]) {
          returnList[i].isHide = false
          break
        } else {
          returnList[i].isHide = true
        }
      }
    }
  }
  return returnList
}

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: config.cookieExpires || 300 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const setCookie = (name, value, expiredays) => {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}
export const getCookie = (name) => {
  var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (arr = document.cookie.match(reg)) {
    // return true;
    return (arr[2])
  } else {
    return false
  }
}
// 删除cookie
export const deleteCookie = name => {
  var date = new Date()
  date.setTime(date.getTime() - 10000)
  document.cookie = name + '=v; expires=' + date.toGMTString()
}
export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}
const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = [...route.matched]
  let lastRoutes = JSON.parse(localStorage.getItem('lastRoutes')) || ''
  if (lastRoutes) {
    [...routeMetched].forEach((item, j) => {
      lastRoutes.some(data => {
        if (item.meta.parentName === data.name) {
          routeMetched.splice(j, 0, data)
        }
      })
    })
  }
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let meta = { ...item.meta }
    if (meta.title && typeof meta.title === 'function') meta.title = meta.title(route)
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  // res = res.filter(item => {
  //   return !item.meta.hideInMenu
  // })
  localStorage.setItem('lastRoutes', JSON.stringify(res))
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

export const getRouteTitleHandled = route => {
  let router = { ...route }
  let meta = { ...route.meta }
  if (meta.title && typeof meta.title === 'function') meta.title = meta.title(router)
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name)

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localSave(config.tagStorageKey, JSON.stringify(list))
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localRead(config.tagStorageKey)
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    // console.log(route, index, list.length)
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const formatAmount = (num) =>{
  if(Number.isNaN(+num)) return null;
  return (+num).toFixed(2).replace(/\B(?=(\d{3})+\b)/g, ",");
};

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}
// 判断输入密码的类型
export const CharMode = iN => {
  if (iN >= 48 && iN <= 57) return 1 // 数字
  if (iN >= 65 && iN <= 90) return 2 // 大写
  if (iN >= 97 && iN <= 122) return 4 // 小写
  else return 8
}
// 计算密码模式
export const bitTotal = num => {
  var modes = 0
  for (var i = 0; i < 4; i++) {
    if (num & 1) modes++
    num >>>= 1
  }
  return modes
}
// 返回强度级别 :纯字母或者纯数字强度为1，数字与字母，'.'号三种其二强度为2，三种类型都有强度为3
export const checkStrong = sPW => {
  if (sPW.length < 6) return 0 // 密码太短，不检测级别
  var Modes = 0
  for (var i = 0; i < sPW.length; i++) {
    Modes |= CharMode(sPW.charCodeAt(i))
  }
  return bitTotal(Modes)
}
// 时间戳转化成时间格式
export const timeFormat = (timestamp,style) => {
  var len = timestamp.toString().split('').length
  var date = len == 10? new Date(timestamp * 1000) : new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = (date.getHours() + 1 < 10 ? '0' + (date.getHours()) : date.getHours())  + ':'
  var m = date.getMinutes() < 10 ? "0" + date.getMinutes() + ':' : date.getMinutes() + ':'
  var s =  (date.getSeconds() + 1 < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
  if (style==='yyyy-mm-dd') {
    var DD = (date.getDate()<10 ? '0' +date.getDate() : date.getDate()) + ' '
    return Y + M + DD + h + m + s
  }
  return Y + M + D + h + m + s
}

/**
 * @param {routers} list 
 * @param {权限列表} accessList 
 * @description 检查返回的权限资源id中是否包含routers中对应的name
 */
export const checkMenuHide = (list, accessData = {}) => {
  let res = [];
  let accessList = {
    ...accessData
  };
  let token = getToken();
  if (token&&localRead(config.menuStorageKey)) { // 如果已经获取到token，则说明登录成功。
    accessList = JSON.parse(localRead(config.menuStorageKey)) || {};
  }
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways))) {
        obj.children = checkMenuHide(item.children, accessList)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (accessList.hasOwnProperty(obj.name)) {
        res.push(obj)
      }
    }
  })
  return res
}

/**
 * @param {*} name
 * @description 检查返回的资源对象中是否含有页面中按钮的权限 
 */
export const checkHasBtn = (name) => {
  let token = getToken();
  if (!token) return false;
  let accessList = JSON.parse(localStorage.getItem(config.btnStorageKey)) || {};
  if (accessList.hasOwnProperty(name)) return true;
  return false;
}

/**
 * 权限返回的信息统一处理
 */
export const authResponseMessage = (res) => {
    if (res.data.success) { //如果是第一次登陆且返回token则直接进入响应
        return res;
    } else if (!res['data']['success']) { // 如果响应返回的success字段为false
        if (messageMap.hasOwnProperty(res.data.code)) {
            setCookie('car-resource-token', '', -1)
            localStorage.accessList = '';
            let msg = res.data.msg || messageMap[res.data.code]
            $Message.error({
                content: msg,
                duration: 3
            })
            router.push({ name: 'login' })
            return res
        }
        return $Message.error({
            content: res.data.msg || '系统错误，请联系管理员',
            duration: 3
        })
    }
    return res;
}