import '@ioc:Adonis/Core/Application'

declare global {
  interface Array<T> {
    forEachPromise(callback): Promise<void>;
  }
}

Array.prototype.forEachPromise = async function (callback) {
  const that = (<Array<any>>this);
  for (let index = 0; index < that.length; index++) {
    await callback(that[index], index, that);
  }
};
