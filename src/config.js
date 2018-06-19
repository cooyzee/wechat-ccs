/**
 * Project's configuration according to customized running environment.
 **/
const version = '1.0.0'

// Variables of development environment
const development = {
  version,
  redisSever: '192.168.0.250',
  redisSeverPorts: [6000, 6001, 6002, 6003, 6004, 6005],
  token: 'WeChatServer4SXB',
  appId: 'wx44bc57e236e7ed54',
  appSecret: '418bf768ff524fef0570f97004753817',
  sxbShop: 'http://shop.local.sxbcar.com',
  templateId: 'oGVsWeTa28_oRMpSFWFow0_3dCewE69IIQxQ3uHEsUQ'
}

// Variables of testing environment
const testing = {

}

// Variables of production environment
const production = {

}

// export the configuration
const env = process.env.NODE_ENV
switch (env) {
  case 'testing':
    exports = testing
    break
  case 'production':
    exports = production
    break
  default:
    exports = development
}
