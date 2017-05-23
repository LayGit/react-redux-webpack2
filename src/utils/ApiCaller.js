import request from 'superagent'
import Sign from './Sign'
import Cookie from './Cookie'
import Global from '../constants/Global.js'

function getCommonHeader() {

  const signRes = Sign.signMd5()

  // 通用参数
  const commonParams = {
    cClientType: 1, // 浏览器
    cToken: Cookie.get('token') || '',
    cAddress: '',
    cLongitude: -1,
    cLatitude: -1,
    cSoftVersion: '',
    cSystemVersion: '',
    cDeviceId: '',
    cSignVersion: 1,
    cTime: signRes.time,
    cSign: signRes.sign
  }
  return commonParams
}

const call = async (inf, params) => {
  const commonParams = getCommonHeader()
  params = params || {}
  //params.time = commonParams.cTime

  const type = inf.type.toLowerCase()
  //let req = request[type](inf.url).type('form').set(commonParams).send(params)

  let req = request[type](inf.url).set(commonParams)
  if (inf.form)
  {
    for (var p in params) {
      req = req.field(p, params[p])
    }
  } else if (type == 'post') {
    req.type('form').send(params)
  } else {
    req.query(params)
  }

  const tsBegin = new Date().getTime()
  let res = await req.then()
  const tsEnd = new Date().getTime()
  if (Global.DEBUG) {
    console.group('[' + type.toUpperCase() + ']请求[' + (tsEnd - tsBegin) + 'ms]:' + inf.url)
    console.log(res.body)
    console.groupEnd()
  }
  return res.body
}

const authCall = async () => {
  if (Cookie.get('token')) {
    let result = call.apply(this, arguments)
    if (result.code == -2) {
      Cookie.remove('token')
      location.href = '/'
    } else {
      return result
    }
  } else {
    location.href = '/'
  }
}

export default {
  call,
  authCall,
  getCommonHeader
}
