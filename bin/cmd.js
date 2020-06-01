#!/usr/bin/env node

'use strict'

const wait = require('../lib/wait_for_url')
const nopt = require('nopt')
const chalk = require('chalk')
const pkg = require('../package')
const knownOpts = {
  url: String
, retries: Number
, delay: Number
}
const shortHand = {
  u: ['--url']
, r: ['--retries']
, d: ['--delay']
}
const parsed = nopt(knownOpts, shortHand)

if (parsed.version) {
  console.log('wait-for-url', `v${pkg.version}`)
  return
}

if (!parsed.url) {
  console.error(chalk.red('--url required to wait'))
  process.exitCode = 1
  return
}

const opts = {
  url: parsed.url
, retries: parsed.retries || 60
, delay: parsed.delay || 1000
}

wait.runWait(opts, (err) => {
  if (err) {
    console.error(chalk.red('wait failed for %s'), opts.url)
    process.exitCode = 1
    return
  }

  console.log(chalk.green('wait success for %s'), opts.url)
})
