const util = require('util')

export default class Transform {
  toJson() {
    return JSON.stringify(this)
  }

  toPrettyJson() {
    return JSON.stringify(this, null, 2)
  }

  toObject() {
    return JSON.parse(this.toJson())
  }

  print(logger = console.log) {
    logger(util.inspect(this, false))
  }
}
