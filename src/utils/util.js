import enquireJs from 'enquire.js'
import moment from 'moment'
import merge from 'deepmerge'
import domtoimage from 'dom-to-image'
import md5 from 'md5'

export { merge, moment, domtoimage }

export function isDef(v) {
  return v !== undefined && v !== null
}

export function isEmpty(val) {
  // null or undefined
  if (val == null) return true
  if (typeof val === 'boolean') return false
  if (typeof val === 'number') return false
  if (val instanceof Error) return val.message === ''
  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length
    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length
    }
  }
  return false
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function deepcopy(obj) {
  const newObj = Array.isArray(obj) ? [] : {}
  for (let i in obj) {
    if (typeof obj[i] == 'object') {
      newObj[i] = deepcopy(obj[i])
    } else {
      newObj[i] = obj[i]
    }
  }
  return newObj
}

const _toString = Object.prototype.toString
export function typeOf(v) {
  const t = typeof v
  if (t === 'string' || t === 'boolean' || t === 'number') {
    return t
  }
  const s = _toString.call(v)
  return s.substr(8, s.length - 9).toLowerCase()
}
export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}
export function isDate(v) {
  return _toString.call(v) === '[object Date]'
}
export function isFunction(v) {
  return _toString.call(v) === '[object Function]'
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    },
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

export function sayHello() {
  const hour = new Date().getHours()
  return hour > 22 && hour < 5
    ? {
        tw: '夜間好',
        cn: '夜间好',
        us: 'good night',
      }
    : hour < 11
    ? {
        tw: '早上好',
        cn: '早上好',
        us: 'good morning',
      }
    : hour < 14
    ? {
        tw: '中午好',
        cn: '中午好',
        us: 'good noon',
      }
    : hour < 18
    ? {
        tw: '下午好',
        cn: '下午好',
        us: 'good afternoon',
      }
    : {
        tw: '晚上好',
        cn: '晚上好',
        us: 'good evening',
      }
}

//输入的h,s,l范围是[0,1]
//输出r,g,b范围为[0,255],可根据需求做相应调整
function hslToRgb(h, s, l) {
  var r, g, b
  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export function randomColor(length, l) {
  const colors = new Array(length)
  return colors.map((e, i) => hslToRgb(i / length, 0.9, l))
}

export function hashToRgb(string, lightness) {
  const codes = md5(string)
    .split('', 6)
    .map((e) => e.charCodeAt() - (e < 'a' ? 48 : 87))
  const hue = (codes[3] * 36 + codes[4]) / (36 * 36)
  const sat = ((codes[5] * 36 + codes[1]) / (36 * 36) + 2) / 3

  const rgb = hslToRgb(hue, sat, lightness)
  return rgb
}

export function strHashColor(string, lightness) {
  return 'rgb(' + hashToRgb(string, lightness).join(',') + ')'
}

/**
 * 防抖:同一個時段內多次觸發只執行最後一次.
 * 使用:
 *  在需要使用的组件引用
 *    import { _debounce } from "@/utils/public";
 *  在methods中使用
 *    methods: {
 *      // 改变场数
 *      changefield: _debounce(function(_type, index, item) {
 *        // do something ...
 *      }, 200)
 *    }
 * @param {function} fn 待執行函數
 * @param {number} delay 防抖的毫秒數millionseconds
 * @return {function}
 */
export function _debounce(fn, delay = 200) {
  var timer = ''
  return function () {
    var th = this
    var args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = ''
      fn.apply(th, args)
    }, delay)
  }
}

/**
 * 節流:間隔一定時間執行同一個函數
 * @param {function} fn
 * @param {number} interval
 * @return {function}
 */
export function _throttle(fn, interval = 200) {
  var last = new Date().getTime()
  var timer
  return function () {
    var th = this
    var args = arguments
    var now = new Date().getTime()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = new Date().getTime()
        fn.apply(th, args)
      }, interval)
    } else {
      last = new Date().getTime()
      fn.apply(th, args)
    }
  }
}

const userAgent = navigator.userAgent
const isOpera = navigator.userAgent.indexOf('Opera') > -1
const isIE =
  userAgent.indexOf('compatible') > -1 &&
  userAgent.indexOf('MSIE') > -1 &&
  !isOpera

export function saveToExcel(table_id, file_name) {
  if (isIE) return saveToObj(table_id)
  else return saveToXls(table_id, file_name)
}

export function saveToObj(str) {
  try {
    // eslint-disable-next-line no-undef
    var xls = new ActiveXObject('Excel.Application')
    xls.Visible = false
  } catch (e) {
    alert(e.Message + '\n請確認已經安裝Excel，且把本網站設置為信任的網站!')
    //if (confirm(e.Message + "\n請確認已經安裝Excel，且把本網站設置為信任的網站,點擊'確認'按鈕以查看演示,否則請點擊'取消'!")) {
    //    window.open("/flash/demo/yonghuchaozuo.swf", "_blank");
    //}
    return
  }
  var xlBook = xls.Workbooks.Add
  var xlsheet = xlBook.Worksheets(1)
  var n = 0
  var aStr = str.split(',')
  for (var a = 0; a < aStr.length; a++) {
    if (a > 0) {
      n += objTable.rows.length
    }
    var objTable = document.getElementById(aStr[a])
    var sCell = ''
    for (var i = 0; i < objTable.rows.length; i++) {
      for (var j = 0; j < objTable.rows[i].cells.length; j++) {
        sCell = objTable.rows[i].cells[j].innerHTML
        for (var t = 0; t < sCell.length / 4; t++) {
          sCell = sCell.replace('<BR>', '\n')
          sCell = sCell.replace('<br>', '\n')
          sCell = sCell.replace('<BR/>', '\n')
          sCell = sCell.replace('<br/>', '\n')
        }
        sCell = sCell.stripTags().unescapeHTML()
        if (sCell.length > 9) sCell = "'" + sCell
        xlsheet.Cells(i + n + 1, j + 1).value = sCell
      }
    }
  }
  //xlsheet.Pictures.Insert('D:/favor/pic/Screw_power.jpg');
  try {
    xls.Visible = true
  } catch (e) {
    alert(e.Message)
  }
}

export function saveToXls(
  tableid,
  filename = 'EF_' + new Date().format('YmdHis')
) {
  if (Array.isArray(tableid)) {
    tableid.forEach((e) => {
      saveToXls(e, 'EF_' + e + '_' + new Date().format('YmdHis'))
    })
    return
  }
  try {
    //window.location.href='<%=basePath%>pmb/excelShowInfo.do';
    //?取表格
    var exportFileContent = document.getElementById(tableid).outerHTML
    //设置格式?Excel，表格?容通?btoa?化?base64，此方法只在文件?小?使用(小于1M)
    //exportFileContent=window.btoa(unescape(encodeURIComponent(exportFileContent)));
    //var link = "data:"+MIMEType+";base64," + exportFileContent;
    //使用Blob
    var blob = new Blob([exportFileContent], {
      type: 'text/plain;charset=utf-8',
    }) //解决中文????
    blob = new Blob([String.fromCharCode(0xfeff), blob], {
      type: blob.type,
    })
    //设置?接
    var link = window.URL.createObjectURL(blob)
    var a = document.createElement('a') //?建a??
    a.download = filename + '.xls' //设置被下载的超链接目录（文件名）
    a.href = link //设置a??的?接
    //document.body.appendChild(a); //a添加到页面
    a.click() //设置a??触发??事件
    //document.body.removeChild(a); //移除a
  } catch (error) {
    console.error('oops, something went wrong!', error)
  }
}

const enCsvCell = function (txt) {
  const comma = typeOf(txt) === 'string' && txt.indexOf(',') > -1
  const quotation = typeOf(txt) === 'string' && txt.indexOf('"') > -1
  if (!comma && !quotation) {
    return txt
  }
  let rtn = txt
  if (quotation) {
    rtn = rtn.replace(new RegExp('"', 'g'), '""')
  }
  if (comma || quotation) {
    rtn = '"' + rtn + '"'
  }
  return rtn
}
export function saveArrToXls(
  aData,
  aColumns = [],
  filename = 'EF_' + new Date().format('YmdHis')
) {
  let exportContent = ''
  if (typeOf(aData) === 'array') {
    if (isEmpty(aColumns) && !isEmpty(aData)) {
      aColumns = Object.keys(aData[0]).map((e) => ({
        dataIndex: e,
        title: e,
      }))
    }
    const title = aColumns.map((e) => enCsvCell(e.title)).join(',')
    if (title) {
      exportContent += title + '\n'
    }
    exportContent += aData
      .map((r, i) =>
        aColumns
          .map((c) =>
            c.dataIndex === '{rowno}' ? i + 1 : enCsvCell(r[c.dataIndex])
          )
          .join(',')
      )
      .join('\n')
  }

  try {
    var blob = new Blob([exportContent], {
      type: 'text/plain;charset=utf-8',
    })
    blob = new Blob([String.fromCharCode(0xfeff), blob], {
      type: blob.type,
    })
    var link = window.URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.download = filename + '.xls'
    a.href = link
    a.click()
  } catch (error) {
    console.error('oops, something went wrong!', error)
  }
}

export function saveToImage(
  domId,
  type = 'png',
  filename = 'EF_' + new Date().format('YmdHis')
) {
  if (Array.isArray(domId)) {
    domId.forEach((e) => {
      saveToImage(e, type, 'EF_' + e + '_' + new Date().format('YmdHis'))
    })
    return
  }
  var node = document.getElementById(domId)
  
  console.log(domtoimage.toPng(node))
  ;(type == 'png'
    ? domtoimage.toPng(node)
    : type == 'jpeg' || type == 'jpg'
    ? domtoimage.toJpeg(node, {
        quality: 0.95,
      })
    : domtoimage.toSvg(node)
  )
    .then(function (dataUrl) {
      //var img = new Image();
      //img.src = dataUrl;
      //document.body.appendChild(img);
      var a = document.createElement('a')
      a.setAttribute('href', dataUrl)
      a.setAttribute('download', filename + '.' + type)
      a.click()
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error)
    })
}
/**
 * Array數組擴展 轉成樹狀結構
 */
Array.prototype.toTree = function (
  root = 0,
  pk = 'id',
  pid = 'pid',
  children = 'children'
) {
  let menuObj = {}
  this.forEach((item) => {
    //item[children] = []
    menuObj[item[pk]] = item
  })
  return this.filter((item) => {
    if (item[pid] !== root) {
      //menuObj[item[pid]][children].push(item)
      menuObj[item[pid]][children]
        ? menuObj[item[pid]][children].push(item)
        : (menuObj[item[pid]][children] = [item])
      return false
    }
    return true
  })
}
Array.prototype.findNode = function (id, pk = 'id', children = 'children') {
  let node = this.find((e) => e[pk] === id)
  if (!node) {
    this.forEach((e) => {
      if (!node && e[children]) {
        const item = e[children].findNode(id, pk, children)
        if (item) {
          node = item
          return item
        }
      }
    })
  }
  return node
}
Array.prototype.mapTree = function (fun, children = 'children') {
  return this.map((e, index, array) => {
    if (!isEmpty(e[children])) {
      e[children] = e[children].mapTree(fun, children)
    }
    return fun(e, index, array)
  })
}

Array.prototype.distinct = function () {
  var arr = this,
    result = [],
    i,
    j,
    len = arr.length
  for (i = 0; i < len; i++) {
    for (j = i + 1; j < len; j++) {
      if (arr[i] === arr[j]) {
        j = ++i
      }
    }
    result.push(arr[i])
  }
  return result
}
/**
 * Date對象擴展
 */
Date.prototype.format = function (format) {
  var o = {
    d: ('0' + this.getDate()).right(2), //day 01~31
    j: this.getDate(), //day 1~31
    m: ('0' + (this.getMonth() + 1)).right(2), //month 01 ~ 12
    n: this.getMonth() + 1, //month 1 ~ 12
    Y: ('000' + this.getFullYear()).right(4), //year 2021
    y: ('0' + this.getFullYear()).right(2), //year 21

    A: this.getHours() < 12 ? 'AM' : 'PM', //AM or PM
    a: this.getHours() < 12 ? 'am' : 'pm', //am or pm
    G: this.getHours(), //hour 00~23
    g: this.getHours() < 13 ? this.getHours : this.getHours - 12, //hour 01~12
    H: ('0' + this.getHours()).right(2), //hour 00~23
    h: ('0' + (this.getHours() % 12 || 12)).right(2), //hour 01~12
    i: ('0' + this.getMinutes()).right(2), //minute 00~59
    s: ('0' + this.getSeconds()).right(2), //second 00~59
    q: Math.floor((this.getMonth() + 3) / 3), //quarter 1~4
    u: ('00' + this.getMilliseconds()).right(3), //millisecond
    v: this.getMilliseconds(), //millisecond
  }
  for (var k in o) {
    if (format.indexOf(k) > -1) {
      format = format.replace(new RegExp(k, 'g'), o[k])
    }
  }
  return format
}
Date.prototype.toStr = function () {
  return this.format('Y-m-d H:i:s')
}
Date.prototype.toDateStr = function () {
  return this.format('Y-m-d')
}
Date.prototype.toTimeStr = function () {
  return this.format('H:i:s')
}
Date.prototype.getDates = function () {
  return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate()
}
Date.prototype.daysInMonth = function () {
  return this.getDates()
}

/**
 * moment對象擴展
 */
moment.prototype.toStr = function () {
  return this.format('YYYY-MM-DD HH:mm:ss')
}
moment.prototype.toDateStr = function () {
  return this.format('YYYY-MM-DD')
}
moment.prototype.toTimeStr = function () {
  return this.format('HH:mm:ss')
}
moment.prototype.getDates = function () {
  return this.daysInMonth()
}

/**
 * String對象擴展
 */
String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, '')
}
String.prototype.left = function (len) {
  return this.substring(0, len)
}
String.prototype.right = function (len) {
  return this.substring(this.length - len, this.length)
}
String.prototype.hashCode = function () {
  let hash = 0,
    i,
    chr
  if (this.length === 0) return hash
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
String.prototype.sort = function (str) {
  return this < str ? -1 : this > str ? 1 : 0
}
String.prototype.replaceAll = function (searchString, replaceWith, ignoreCase) {
  return this.replace(
    new RegExp(searchString, ignoreCase ? 'gi' : 'g'),
    replaceWith
  )
}
String.prototype.toHump = function () {
  return this.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}
String.prototype.toUnderLine = function () {
  return this.replace(/([A-Z])/g, '_$1').toLowerCase()
}

Number.prototype.toChange = function () {
  var i = Math.floor(Math.log(this) / Math.log(1000))
  var n = this / Math.pow(1000, i)
  var unit = ['B', 'K', 'M', 'G', 'T', 'P']

  return n.toFixed(0) + unit[i]
}
