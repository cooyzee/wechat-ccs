/**
 * Custom the buttons of wechat official account
 **/
const redisClient = require('./redis_client')
const config = require('./config')
const request = require('request')

exports.setButton = (req, res) => {
  redisClient.query('access_token', value => {
    const url = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + value
    const params = {
      button:[
          {
            type: "view",
            name: "关注的展厅",
            url: config.sxbShop + '/shop/shopList'
          }
        ]
      }
    request.post({
        url,
        body: JSON.stringify(params)
      },
      (error, response, body) => {
        res.json(body)
      }
    )
  })
}
