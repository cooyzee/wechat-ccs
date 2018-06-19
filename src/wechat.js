/**
 * Main js for wechat coding
 **/
const async = require('async')
const sha1 = require('sha1')
const request = require('request')
const config = require('./config')
const redisClient = require('./redis_client')

// validate the server url
exports.validate = (req, res) => {
  let {signature, timestamp, nonce, echostr} = req.query
  let mySignature = sha1([config.token, timestamp, nonce].sort().join(''))
  if(signature == mySignature){
    console.log('Valid server address, access successfully.')
    res.send(echostr)
  }else{
    res.send('Error!')
    console.log(new Date().toLocaleTimeString()+'access denied.')
  }
}

// scan qr code, auto send a message
let sendShopMsg = (shopId, params, res) => {
  request(config.sxbShop + '/shopData/wechatGetShopInfo/' + shopId, (error, response, body) => {
    if (body) {
      let shop = JSON.parse(body)
      let createTime = new Date().getTime()
      let banner = shop['doorHeadUrl'] ? shop['doorHeadUrl'] : config.sxbShop + '/assets/img/header.jpg'
      let activity = ''
      let aL = shop['activityList']
      let count = 2
      if (aL && aL.length > 0) {
        count = count + aL.length
        for (let i = 0; i < aL.length; i++) {
          let temp = [
            `<item>`,
            `<Title><![CDATA[【活动】${aL[i].title}]]></Title>`,
            `<Description><![CDATA[description]]></Description>`,
            `<PicUrl><![CDATA[${aL[i].webpageMaterialUrl}]]></PicUrl>`,
            `<Url><![CDATA[${config.sxbShop}/shop/${shopId}/activityDetail/${aL[i].activityId}]]></Url>`,
            `</item>`,
          ]
          activity = activity + temp.join('')
        }
      }
      let msg = [
        `<xml>`,
        `<ToUserName><![CDATA[${params['FromUserName']}]]></ToUserName>`,
        `<FromUserName><![CDATA[${params['ToUserName']}]]></FromUserName>`,
        `<CreateTime>${createTime}</CreateTime>`,
        `<MsgType><![CDATA[news]]></MsgType>`,
        `<ArticleCount>${count}</ArticleCount>`,
        `<Articles>`,
        `<item>`,
        `<Title><![CDATA[【${shop.shopDesc}】全新的汽车互联网代购平台，前往展厅首页]]></Title>`,
        `<Description><![CDATA[description]]></Description>`,
        `<PicUrl><![CDATA[${banner}]]></PicUrl>`,
        `<Url><![CDATA[${config.sxbShop}/shop/${shopId}/index]]></Url>`,
        `</item>`,
        activity,
        `<item>`,
        `<Title><![CDATA[【在线交流】立即联系商家，询问价格详情]]></Title>`,
        `<Description><![CDATA[description]]></Description>`,
        `<PicUrl><![CDATA[${config.sxbShop}/assets/img/share_talk.jpg]]></PicUrl>`,
        `<Url><![CDATA[${config.sxbShop}/shop/${shopId}/chat]]></Url>`,
        `</item>`,
        `</Articles>`,
        `</xml>`,
      ].join('')
      res.send(msg)
      return
    }
    res.send('')
  })
}

exports.message = (req, res) => {
  let params = req.body.xml
  let msgType = params['MsgType']
  // 不是事件推送，直接回复空串, 不做任何处理
  if (msgType != 'event') {
    res.send('')
    return
  }

  let event = params['Event']
  let eventKey = params['EventKey']
  eventKey = eventKey[0]
  if (event == 'subscribe') {
    if (eventKey) { // 未关注 扫描带参二维码
      let shopId = eventKey.split('_')[1]
      sendShopMsg(shopId, params, res)
      return
    } else { // 关注事件
      let content = '欢迎关注网上展厅公众号，点击下方【关注的展厅】可查看已浏览过的网上展厅列表。'
      let createTime = new Date().getTime()
      let resMsg = [
        `<xml>`,
        `<ToUserName><![CDATA[${params['FromUserName']}]]></ToUserName>`,
        `<FromUserName><![CDATA[${params['ToUserName']}]]></FromUserName>`,
        `<CreateTime>${createTime}</CreateTime>`,
        `<MsgType><![CDATA[text]]></MsgType>`,
        `<Content><![CDATA[${content}]]></Content>`,
        `</xml>`,
      ].join('')
      res.send(resMsg)
      return
    }
  }
  // 已关注 扫描带参二维码
  if (event == 'SCAN') {
    console.log(eventKey)
    sendShopMsg(eventKey, params, res)
    return
  }
  res.send('')
}

// get access_token and jsapi_ticket
exports.getTokenAndTicket = function () {
  async.waterfall([
    function (callback) {
      let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`
      request(url, (err, res, body) => {
        if(!err && res.statusCode == 200){
          let token = JSON.parse(body)['access_token']
          redisClient.save('access_token', token)
          callback(null, token)
        }
      })
    },
    function (token, callback) {
      let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
      request(url, (err, res, body) => {
        if(!err && res.statusCode == 200){
          let ticket = JSON.parse(body)['ticket']
          redisClient.save('jsapi_ticket', ticket)
          callback(null, ticket)
        }
      })
    }
  ], function (err, result) {
    if(err){
      console.log('Some error happened when get token and ticket!')
    }
  })
}
