import '@ioc:Adonis/Core/Application'

declare global {
  interface String {
    toNameCase(): string
  }
}

String.prototype.toNameCase = function () {
  return this.toLowerCase()
    .replaceAll('_', ' ')
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
