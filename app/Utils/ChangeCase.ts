export default class ChangeCase {
  static toTitle(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    )
  }

  static variableCase(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  static toUpper(str) {
    return str.toUpperCase()
  }

  static toLower(str) {
    return str.toLowerCase()
  }
}
