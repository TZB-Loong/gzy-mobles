import moment from 'moment';
import { requestUrl } from '../confingPath';
import wx from 'weixin-js-sdk'
export function getCookie() {
  let gzyToken = '';
  // let gzyToken ='';
  const strcookie = document.cookie;      //获取cookie字符串
  let arrcookie = strcookie.split(';');   //分割
  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split('=')[0];
    if (arr == 'gzy-token') {
      gzyToken = arrcookie[i].replace(arr + '=', '');
    }
  }
  return gzyToken;
}

export function isfalse(param) {
  //判断某个对象里面是否为空（数组，对象里面的值{应该将函数排除在外}）
  let r = ['', undefined, null, false].indexOf(param) >= 0;
  if (r === false) {
    if (param.length === 0) {
      // if (typeof param=='function'){
      //     r = false;
      // }
      // else if  ( param.length === 0 ){
      r = true;
    } else if (param.construtor) {
      r = Object.keys(param).length === 0;
    } else if (typeof param == 'object') {
      r = Object.keys(param).length === 0;
    }
  }
  return r;
};

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
//生成随机数
export function uuid() {
  let s = [];
  let hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23];

  let uuid = s.join('');
  return uuid;
}
export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}
//阿拉伯数字转中文
export function SectionToChinese(section) {
  let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
  let chnUnitChar = ['', '十', '百', '千'];
  let strIns = '',
    chnStr = '';
  let unitPos = 0;
  let zero = true;
  while (section > 0) {
    var v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
}
function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}


export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}


/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}
/**
 * 获取请求参数
 * @param name
 * @returns {*}
 */
export function getUrlParamBySearch(url, name) {
  url = url+ "";
  let regstr = "/(\\?|\\&)" + name + "=([^\\&]+)/";
  let reg = eval(regstr);
  //eval可以将 regstr字符串转换为 正则表达式
  let result = url.match(reg);
  if (result && result[2]) {
    return result[2];
  }
}
export default function Share(_title,_desc,_link,successFn,cancelFn){

  /** 参数说明
   * |---|---|---|---|---|
   * |名称|类型|说明|默认|是否必须
   * |title|string|标题|无|是
   * |link|string|分享给别人的链接|当前地址|否
   * |successFn|function|用户确认分享后执行的回调函数|无|否
   * |cancelFn|function|用户取消分享后执行的回调函数|无|否
   */
  let jsApi = requestUrl + "/wechat/api/jsapiTicket?accessUrl=" + encodeURIComponent(window.location.href);
  fetch(jsApi, {
    method: 'post',
    Accept: "*/*",
    mode: 'cors',
    credentials: 'include',
  })
    .then(res => res.json())
    .then(
      (data) => {
        if (data.respCode === 0) {
          wx.config({
            debug: false, // 开启调试模式
            appId: data.respResult.appId,
            timestamp: data.respResult.timestamp,
            nonceStr: data.respResult.nonceStr,
            signature: data.respResult.signature,
            jsApiList: [
              'onMenuShareAppMessage',
              'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
          });
          setTimeout(function () {
            wx.ready(function () {
              wx.onMenuShareAppMessage({ //分享给朋友
                title: _title,
                desc: _desc,
                link:isfalse(_link)?window.location.href+'?from=timeline&isappinstalled=0':_link+'?from=timeline&isappinstalled=0',
                imgUrl: 'https://resources.gzy360.com/resource/static/images/icons/favicon.ico',
                success: function () {
                  // 用户确认分享后执行的回调函数
                  if(!isfalse(successFn)){
                    successFn()
                  }
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                  if(!isfalse(cancelFn)){
                    cancelFn()
                  }
                }
              });
              wx.onMenuShareTimeline({ //分享到朋友圈
                title: _link,
                desc: _desc,
                link: isfalse(_link)?window.location.href:_link,
                imgUrl: 'https://resources.gzy360.com/resource/static/images/icons/favicon.ico',
                success: function () {
                  // 用户确认分享后执行的回调函数
                  if(!isfalse(successFn)){
                    successFn()
                  }
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                  if(!isfalse(cancelFn)){
                    cancelFn()
                  }
                }
              });
            })
            wx.error(function (res) {
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
          }, 2000);

        } else {
          //                            console.log(result.respResult.errMsg);
        }
      },
      (error) => {
        console.log(error)
      }
    );

}

export  function timestampToTime(timestamp, HMS) {
  //时间戳转换为时间格式
  /** 参数格式说明
   * |参数名称|参数类型|参数说明|是否必须
   * |timestamp|string或者number|时间戳或者时间格式|是
   * |HMS|string|返回的时间格式{
   *                              underfind:返回 年-月-日
   *                              HMS:返回 年-月-日  时:分:秒
   *                              HM:返回 年-月-日  时:分
   *                              H: 返回 年-月-日  时
   *                          }   |否
   */
  if (typeof timestamp == 'string') {
    //兼容ios

    timestamp = timestamp.replace(/\-/g, '/');
  }
  if (timestamp == null) {
    return '';
  }

  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
  if (HMS == 'HMS') {
    //返回年月日,时分秒
    var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + ' ' + h + m + s;
  }
  if (HMS == 'HM') {
    //返回年月日,时分
    var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return Y + M + D + ' ' + h + m;
  }
  if (HMS == 'H') {
    //返回年月日,时
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    return Y + M + D + ' ' + h + ':00';
  }

  return Y + M + D; //只返回年月日
}

export function url2params(urlstr) {
  var u = decodeURIComponent(urlstr);
  // console.log(u.slice( u.indexOf('?')+1),'u')
  u = u.slice(u.indexOf('?') + 1);
  var args = {};
  var item = null;
  u.split('&').map(itm => {
    item = itm.split('=');
    args[item[0] ? item[0] : ''] = item[1] ? decodeURIComponent(item[1]) : '';
  });
  delete args[''];
  return args;
}

