let app = require('express')()
let bodyParser = require('body-parser')
let wechat = require('./src/wechat')
let customButton = require('./src/customButton')
let redisClient = require('./src/redis_client')
let templateMsg = require('./src/templateMsg')
let config = require('./src/config')

// initiate token and ticket and refresh them every 2 hours
wechat.getTokenAndTicket();
setInterval(function () {
  wechat.getTokenAndTicket()
}, 7200e3);

require('body-parser-xml')(bodyParser);
app.use(bodyParser.xml());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Hello there! This is the central control sever for our wechat service.')
});

app.get('/message', wechat.validate);
app.post('/message', wechat.message);
app.get('/setButton', customButton.setButton);
app.post('/sendTplMsg', templateMsg);

app.get('/getAccessToken', function (req, res) {
  redisClient.query('access_token', (value) => res.send({access_token:value}))
});

app.get('/getJsTicket', function (req, res) {
  redisClient.query('jsapi_ticket', (value) => res.send({jsapi_ticket:value, appId: config.appId}))
});

app.listen(5086, function () {
  console.log(`Wechat central server now listening on port 5086 with ${process.env.NODE_ENV} environment.`)
});