const config = require('./config')
const app = require('express')()
const bodyParser = require('body-parser')

const wechat = require('./controllers/wechat')
const customButton = require('./controllers/customButton')
const redisClient = require('./controllers/redis_client')
const templateMsg = require('./controllers/templateMsg')

// initiate token and ticket and refresh them every 2 hours
wechat.getTokenAndTicket()
setInterval(() => {
  wechat.getTokenAndTicket()
}, 7200e3)

require('body-parser-xml')(bodyParser)
app.use(bodyParser.xml())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.send('Hello there! This is the central control sever for our wechat service.')
})

app.get('/message', wechat.validate)
app.post('/message', wechat.message)
app.get('/setButton', customButton.setButton)
app.post('/sendTplMsg', templateMsg)

app.get('/getAccessToken', (req, res) => {
  redisClient.query('access_token', (value) => res.send({access_token:value}))
})

app.get('/getJsTicket', (req, res) => {
  redisClient.query('jsapi_ticket', (value) => res.send({jsapi_ticket:value, appId: config.appId}))
})

app.listen(5086, () => {
  console.log(`Wechat central server now listening on port 5086 with ${process.env.NODE_ENV} environment.`)
})