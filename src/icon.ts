import fs = require("fs")
import pathUtil = require("path")
const { debug } = require("b-logger")("copilot.icon")
export class IconHelper {
  private icons: { [name: string]: string }
  private iconNameRule: RegExp
  constructor(path: string[], img = /\.(jpg|png|gif)$/, iconNameRule = /[a-zA-Z0-9]+(\.[a-zA-Z0-9]*)*/) {
    this.iconNameRule = iconNameRule
    this.icons = {}
    for (let p of path) {
      fs.readdirSync(p)
        .filter(img.test.bind(img))
        .forEach((file) => {
          this.icons[pathUtil.parse(file).name] = pathUtil.join(p, file)
        })
    }
    debug(this.icons)
  }
  public fixIcon(icon: string) {
    icon = icon || "buildin.default"
    if (this.iconNameRule.test(icon)) {
      return this.icons[icon] || this.icons["buildin.default"]
    }
    if (icon.startsWith("/")) {
      return `file:///${icon}`
    }
    return icon
  }
}
