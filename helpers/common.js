// 获取终端ip
const getClientIP = req => {
  const forwardedIpsStr = req.header('x-forwarded-for')
  if (forwardedIpsStr) {
    const forwardedIp = forwardedIpsStr.split(',')[0]
    if (forwardedIp) {
      return forwardedIp
    } else {
      return req.connection.remoteAddress
    }
  }
}

module.exports = {
  getClientIP
}