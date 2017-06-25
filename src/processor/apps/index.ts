const os = require("os")
if (os.platform() === "linux") {
  module.exports = require("./linux")
} else {
  module.exports = {
    default: {}
  }
}
