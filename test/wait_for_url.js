'use strict'

const test = require('tap').test
const http = require('http')
const wait = require('../lib/wait_for_url')

var failCount = 0

const server = http.createServer((req, res) => {
  if (req.url.includes('health_check_success')) {
    res.writeHead(200, {
      'content-type': 'application/json'
    })
    res.end(JSON.stringify({name: 'wait-test'}))
  } else if (req.url.includes('health_check_fail')) {
    res.writeHead(404, {
      'content-type': 'application/json'
    })
    res.end(JSON.stringify({
      message: 'Not found'
    }))
  } else if (req.url.includes('health_check_delay')) {
    // Send failure for the first 5 attempts
    if (failCount < 2) {
      failCount++
      res.writeHead(404, {
        'content-type': 'application/json'
      })
      return res.end(JSON.stringify({
        message: 'Not found'
      }))
    }

    res.writeHead(200, {
      'content-type': 'application/json'
    })
    res.end(JSON.stringify({name: 'wait-test'}))
  }

  res.writeHead(500, {
    'content-type': 'application/json'
  })
  res.end(JSON.stringify({
    message: 'Internal server error'
  }))
})

test('setup', (t) => {
  server.listen(0, () => {
    process.env.PORT = server.address().port
    t.pass('server is listening')
    t.end()
  })
})

test('runWait success', (t) => {
  const PORT = process.env.PORT
  const opts = {
    url: `http://localhost:${PORT}/health_check_success`
  , retries: 5
  , delay: 1000
  }

  wait.runWait(opts, (err) => {
    t.error(err)
    t.end()
  })
})

test('runWait failure', (t) => {
  const PORT = process.env.PORT
  const opts = {
    url: `http://localhost:${PORT}/health_check_fail`
  , retries: 5
  , delay: 1000
  }

  wait.runWait(opts, (err) => {
    t.type(err, Error)
    t.equal(err.message, 'URL never returned 200 status code', 'error message')
    t.end()
  })
})

test('runWait delayed success', (t) => {
  const PORT = process.env.PORT
  const opts = {
    url: `http://localhost:${PORT}/health_check_delay`
  , retries: 5
  , delay: 1000
  }

  wait.runWait(opts, (err) => {
    t.error(err)
    t.end()
  })
})

test('cleanup', (t) => {
  server.close()
  t.end()
})
