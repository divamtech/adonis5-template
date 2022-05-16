export default class TypeConversions {
  public static toBoolean(value: string): boolean {
    if (!!value) {
      switch (value.toLowerCase()) {
        case "true":
        case '1':
        case "on":
        case "yes":
          return true;
      }
    }
    return false;
  }
}
