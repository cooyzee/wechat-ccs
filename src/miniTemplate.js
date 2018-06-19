// Deprecated
const request = require('request')

module.exports = (req, res) => {
  let token = '6_J82pcsRa5Dzzd-Qyz9ZNMIU7v5Qt2GlaLqXK4QpnFiE-VaLJRSonZull-zoruBlYhhx1rHlug9L2Yug_2QiK9MPPU84MkqYGFf2YL3VtL13PEiRetG0W53nDXrqN-rbS4cnWCtjQrcPtUtZRULSbAFABSZ'
  let url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${token}`
  let params = {
    touser: 'oNEsG0ZGwdr0PNPuybKFGlIUECCw',
    template_id: 'QoQcnYVHAWeH5hGjJck3ZFwQLKfbBG0Nsae8ZmWLdgU',
    page: 'pages/index/index',
    form_id: 'a508de16c203374f495cf4d9198c848a',
    data: {
      keyword1: {value: '待回访提醒'},
      keyword2: {value: '今日您有XX个客户待回访，请及时处理。'},
      keyword3: {value: '点击进入小程序查看', color: '#888888'}
    },
    emphasis_keyword: 'keyword1.DATA'
  }
  // request.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx64d2257127be6c7f&secret=61c31b9df18a7d863f9d1fd0e1d85f42`, (error, response, body) => {
  //   res.send(body)
  // })
  request({
    url,
    method: 'POST',
    body: params,
    json: true
  }, (error, response, body) => {
    res.send(body)
  })
}
