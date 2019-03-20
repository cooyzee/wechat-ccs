/**
 * Send template message
 **/

const redisClient = require('../helpers/redis')
const config = require('../config')
const request = require('request')

let templateUrl = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='
// could've use dateformat
let timeFilter = (date) => {
  let h = date.getHours()
  let m = date.getMinutes()
  h = h > 9 ? h : ('0' + h)
  m = m > 9 ? m : ('0' + h)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + h + ':' + m
}

module.exports = (req, res) => {
  let openId = req.body.openId
  let shopId = req.body.shopId
  let shopName = req.body.shopName
  let message = req.body.message
  let time = req.body.time

  if (!openId || !shopId || !shopName || !message || !time) {
    res.send({success: 'false', msg: '参数不齐全'})
    return
  }

  // time format
  time = timeFilter(new Date(parseInt(time)))

  let params = {
    touser: openId,
    template_id: config.templateId,
    url: `${config.sxbShop}/shop/${shopId}/chat`,
    data: {
      first: {value: '您收到新的商家反馈'},
      keyword1: {value: shopName, color: '#0099FF'},
      keyword2: {value: time},
      keyword3: {value: message, color: '#0099FF'},
      remark: {value: '点击查看详情'},
    }
  }
  redisClient.query('access_token', (value) => {
    if (value) {
      request.post({url: templateUrl + value, body: JSON.stringify(params)}, (error, response, body) => {
        res.send({success: !error && response.statusCode == 200})
      })
    } else {
      res.send({success: false})
    }
  })
}
