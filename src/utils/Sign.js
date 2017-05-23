import Security from './Security'

function signMd5 () {
  const time = new Date().getTime()
  return { time: time, sign: Security.encryptMd5(time + 'security.matu.ltd')}
}

export default {
  signMd5: signMd5
}
