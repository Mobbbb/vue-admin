import { getToken } from './util.js'
import fileDownload from 'js-file-download'
import axios from 'axios'
import Vue from 'vue'

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let res = []
  arr1.filter(function(v){ 
    if(arr2.indexOf(v) > -1) res.push(v)
  })

  return res
}

/**
 * @param {Array} date1
 * @param {Array} date2
 * @description 判断两个日期是否相交
 */
export const hasDatesection = (date1, date2) => {
  let res = []
  let startTime1 = Date.parse(date1[0])
  let endTime1 = Date.parse(date1[1])
  let startTime2 = Date.parse(date2[0])
  let endTime2 = Date.parse(date2[1])
  console.log(startTime1)
  if(endTime1 < startTime2){
    return true
  } else if(startTime1 > endTime2){
    return true
  } else {
    return false
  }
}

/**
 * @param {Array} date1
 * @param {Array} date2
 * @description 判断两个时间是否相交
 */
export const hasTimesection = (date1, date2) => {
  let startTime1 = new Date('2000-01-10 ' + date1[0])
  let endTime1 = new Date('2000-01-10 ' + date1[1])
  let startTime2 = new Date('2000-01-10 ' + date2[0])
  let endTime2 = new Date('2000-01-10 ' + date2[1])
  startTime1 = Date.parse(startTime1)
  startTime2 = Date.parse(startTime2)
  endTime1 = Date.parse(endTime1)
  endTime2 = Date.parse(endTime2)
  if(endTime1 <= startTime2){
    return true
  } else if(startTime1 >= endTime2){
    return true
  } else {
    return false
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp)
  return timeStr.length > 10
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000)
  const year = d.getFullYear()
  const month = getHandledValue(d.getMonth() + 1)
  const date = getHandledValue(d.getDate())
  const hours = getHandledValue(d.getHours())
  const minutes = getHandledValue(d.getMinutes())
  const second = getHandledValue(d.getSeconds())
  let resStr = ''
  if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
  else resStr = month + '-' + date + ' ' + hours + ':' + minutes
  return resStr
}

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStamp)
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor(timeStamp /= 1000)
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp)
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000)
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStamp, currentTime)
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff
  let resStr = ''
  const dirStr = IS_EARLY ? '前' : '后'
  // 少于等于59秒
  if (diff <= 59) resStr = diff + '秒' + dirStr
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp)
  else resStr = getDate(timeStamp, 'year')
  return resStr
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) return 'IE'
  else if (isExplorer('Firefox')) return 'Firefox'
  else if (isExplorer('Chrome')) return 'Chrome'
  else if (isExplorer('Opera')) return 'Opera'
  else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}

/**
 * @param {Array} data 对象数组
 * @param {String} id 自身标识
 * @param {String} pid 父级标识
 * @return {Array} res 树形结构
 * @description 将同级结构的数据转化成树形结构
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * @param {Array} menuIdList 存储包含半选节点的uuid数组
 * @param {Array} showIdlist 存储不包含半选节点的uuid数组
 * @param {Array} listData iview树形控件返回的勾选数组
 * @param {Array} data 无级树总数组
 * @description iview树形控件勾选优化,勾选半选节点
 */
export function getCheckedNode (menuIdList, showIdlist, listData, data) {
  let temp = false
  for (let l = 0; l < data.length; l++) {
    menuIdList.push(data[l].uuid) // 加入该选中项
    showIdlist.push(data[l].uuid)
  }
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < listData.length; j++) {
      if (data[i].resourceParent === listData[j].uuid) { // 找到该选中项的父节点
        for (let h = 0; h < menuIdList.length; h++) { // 看看该父节点是否已经添加
          if (data[i].resourceParent === menuIdList[h]) {
            temp = true
            break
          }
        }
        if (temp === false) { // 该父节点未被添加
          menuIdList.push(data[i].resourceParent) // 加入该父节点
          data.push(listData[j]) // 把该也加入循环队列，以供寻找该父节点的父节点
        }
        temp = false
      }
    }
  }
}

/**
 * @param {Array} listData 无级树总数组
 * @param {Array} data 包含父节点的id数组
 * @return {Array} data 不包含父节点的id数组
 * @description iview树形控件回显优化,去除勾选项中的父节点
 */
export function popParentNode (listData, data, key="resourceParent") {
  for (let i = 0; i < listData.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (listData[i][key] === data[j]) {
        data.splice(j, 1)
      }
    }
  }
  return data
}

/**
 * @param {String} testValue 待校验字符串
 * @param {String} type 校验类型
 * @return {Boolean} 校验结果
 * @description 正则校验
 */
export const regTest = (testValue, type) => {
  var mobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9]|16[0-9])[0-9]{8}$/
  var phone = /^([0-9]{3,4}-)?[0-9]{7,8}$/
  var email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  switch (type) {
    case 'phone&mobile':
      return (phone.test(testValue) || mobile.test(testValue))
    case 'phone':
      return phone.test(testValue)
    case 'mobile':
      return mobile.test(testValue)
    case 'email':
      return email.test(testValue)
    default: 
      return false
  }
}

/**
 * @param {Object} allFields 所有table列
 * @param {Array} selectIds 展示的id表
 * @description 返回id表中存在的table列
 */
export const getCustomFields = (allFields, selectIds) => {
  let arr = []
  for(let i = 0; i < allFields.length; i++){
    for(let j = 0; j < selectIds.length; j++){
      if(allFields[i].key === selectIds[j]){
        arr.push(allFields[i])
      }
    }
  }
  if(arr.length===0) arr = [...allFields]

  return arr
}

/**
 * @param {Array} cpList 所有省市数据
 * @param {String} key value所对应的键名
 * @description 省市数据结构化
 */
export const cpTranslate = (cpList, provinceKey='', citykey='') => {
  let arr = JSON.parse(JSON.stringify(cpList))
  if(provinceKey === ''){
    arr.forEach(function(item, index){
      item.value = item.provinceID
      item.label = item.province
      item.children = item.nodes
      item.children.forEach(function(_item, _index){
        _item.value = _item.cityID
        _item.label = _item.city
      })
    })
  } else {
    arr.forEach(function(item, index){
      item.value = item[provinceKey]
      item.label = item.province
      item.children = item.nodes
      item.children.forEach(function(_item, _index){
        _item.value = _item[citykey]
        _item.label = _item.city
      })
    })
  }
  return arr
}

/**
 * @param {Array} cpList 所有省、市、运营商数据
 * @param {String} key value所对应的键名
 * @description 省市运营商数据结构化
 */
export const cppTranslate = (cppList) => {
  let returnData = []
  let arr = JSON.parse(JSON.stringify(cppList))
  changeKeyMethod(arr)
  changeKeyMethod(arr, 'uuid', 'value')
  return arr
}

/**
 * @param {Object} param 搜索参数
 * @param {String} url 请求api地址
 * @description 导出文件
 */
export const exportFile = (param, url, fileName) => {
  axios({
    method: 'post',
    headers: {'Authorization': getToken()},
    url: Vue.prototype._baseUrl + url,
    data: param,
    responseType: 'blob', // 如果项目中引入了mock模块，会更改blob数据，返回乱码
  }).then(function (res) {
    if(res.data) fileDownload(res.data, fileName + '.xlsx')
  }).catch(function (error) {
    console.log(error)
  })
}

/**
 * @description 数组转字符串
 */
export const arrStringify = (arr) => {
  let str = ''
  let arr1 = JSON.parse(JSON.stringify(arr))
  arr1.forEach(function(item, index){
    if(index !== arr1.length - 1){
      str += JSON.stringify(item) + ';'
    } else {
      str += JSON.stringify(item)
    }
  })

  return str
}

/**
 * @description 字符串转数组
 */
export const strParse = (str) => {
  let arr = str.split(';')
  let arr2 = []
  arr.forEach(function(item, index){
    arr2.push(JSON.parse(item))
  })

  return arr2
}

/**
 * @param {Array} arr 树
 * @param {String} key key名
 * @param {String} targetKey 目标key名
 * @description 为树更改字段
 */
export const changeKeyMethod = (arr, key="title", targetKey="label") => {
  changeKey(arr, key, targetKey)
  function changeKey(arr, key, targetKey){
    for(let i = 0; i < arr.length; i++){
      arr[i][targetKey] = arr[i][key]
      if(typeof(arr[i].children) !== 'undefined'){
        changeKey(arr[i].children, key, targetKey)
      }
    }
  }
}

/**
 * @param {Array} arr 树
 * @param {String} key key名
 * @param {String} targetKey 目标key名
 * @description 为list更改字段
 */
export const changeListKey = (arr, key="title", targetKey="label") => {
  for(let i = 0; i < arr.length; i++){
    arr[i][targetKey] = arr[i][key]
  }
}

/**
 * @param {Array} treeArr 树
 * @param {Array} ids 目标id数组
 * @description 从树中提取目标id的title
 */
export const selectLabelByIds = (treeArr, ids) => {
  let labelList = []
  recursion(treeArr, ids, labelList)
  function recursion(treeArr, ids, labelList){
    for(let i = 0; i < treeArr.length; i++){
      for(let j = 0; j < ids.length; j++){
        if(treeArr[i].uuid === ids[j]){
          labelList.push({
            title: treeArr[i].title
          })
        }
      }
      if(typeof(treeArr[i].children) !== 'undefined'){
        recursion(treeArr[i].children, ids, labelList)
      }
    }
  }

  return labelList
}

/**
 * @param {Array} treeArr 树
 * @param {Array} ids 目标id数组
 * @description 从树中提取目标id的item
 */
export const selectItemByIds = (treeArr, ids, key="value") => {
  let labelList = []
  recursion(treeArr, ids, labelList)
  function recursion(treeArr, ids, labelList){
    for(let i = 0; i < treeArr.length; i++){
      for(let j = 0; j < ids.length; j++){
        if(treeArr[i][key] === ids[j]){
          labelList.push(treeArr[i])
        }
      }
      if(typeof(treeArr[i].children) !== 'undefined'){
        recursion(treeArr[i].children, ids, labelList)
      }
    }
  }

  return labelList
}

/**
 * @param {String} value cityCode的值
 * @param {String} cityKey cityCode在list中对应的键名
 * @description 根据cityCode获取ProvinceCode
 */
export const getProvinceCodeByCityKey = (value, cityKey='cityID') => {
  let code = ''
  let cpArr = JSON.parse(localStorage.getItem('provinceCityList'))
  cpArr.forEach(item => {
    if(item[cityKey] === value) code = item.provinceID
  })

  return code
}

/**
 * @param {Array} list 列表
 * @param {Array} id 叶子节点id
 * @description 从list列表中获取该叶子节点的所有父节点
 */
export const getAllParentsId = (list, id) => {
  let arr = [id]
  let i = 0
  let parentId = ''
  let flag = false // 第一个id是否有父亲
  let temp = true
  list.forEach((item, index) => {
    if(item.id === id){
      parentId = item.parentId
      arr.unshift(item.parentId)
      flag = true
    }
  })
  if(flag) { // 如果有父亲
    flag = false
    while(temp){
      list.forEach((item, index) => {
        if(item.id === parentId){
          arr.unshift(item.id)
          parentId = item.parentId
          flag = true
        }
      })
      if(!flag) temp = false // 如果没有父亲
      flag = false
      i++
    }
  }
  return arr
}

export const downloadIamge = (imgsrc, name) => { //下载图片地址和图片名
  var image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
 
    var a = document.createElement("a"); // 生成一个a元素
    var event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imgsrc;
}