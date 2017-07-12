let { platform } = require("os")
if (platform() === "linux") {
  module.exports = require("./linux")
} else {
  module.exports = {
    default: {}
  }
}
