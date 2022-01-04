'use strict'

module.exports = (platform = '') => {
  platform = platform.toLowerCase()
  return ['linux', 'darwin', 'freebsd', 'sunos'].indexOf(platform) !== -1
}
