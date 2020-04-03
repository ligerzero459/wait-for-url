'use strict'

const http = require('http')
const chalk = require('chalk')

function get(url, cb) {
  http.get(url, (res) => {
    if (res.statusCode === 200) return cb()
    const err = new Error(`Received status code: "${res.statusCode}"`)
    cb(err)
  }).on('error', cb)
}

exports.runWait = function runWait(opts, cb) {
  const a = new Array(opts.retries).fill(1)
  const run = () => {
    if (!a.length) return cb(new Error('URL never returned 200 status code'))
    console.log(chalk.yellow('Attempt', `#${opts.retries - a.length}`))

    a.shift()
    get(opts.url, (err) => {
      if (!err) return cb()

      setTimeout(run, opts.delay)
    })
  }

  run()
}
