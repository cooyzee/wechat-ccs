/**
 * Redis client
 **/
const redis = require('ioredis')
const config = require('./config')
const host = config.redisSever
const ports = config.redisSeverPorts

let hostArray = ports.map(port => ({port, host}))

let cluster = new redis.Cluster(hostArray)

exports.save = (key, value) => {
  cluster.set(`sxb_web_node_${key}`, value)
}

exports.query = (key, callback) => {
  cluster.get(`sxb_web_node_${key}`, (err, res) => {
    callback(res)
  })
}
