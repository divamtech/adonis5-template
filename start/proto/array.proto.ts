import '@ioc:Adonis/Core/Application'

declare global {
  interface Array<T> {
    forEachPromise(callback): Promise<void>
    mapPromise(callback): Promise<Array<T>>
    filterPromise(callback): Promise<Array<T>>
    cloneDeep(): Array<T>
    flatToTreeView(childArrayKey: string, parentIdKey: string, primaryKey?: string): Array<T>
    treeToFlatView(childArrayKey: string, primaryKey?: string): Array<T>
  }
}

Array.prototype.forEachPromise = async function (callback) {
  const that = <Array<any>>this
  for (let index = 0; index < that.length; index++) {
    await callback(that[index], index, that)
  }
}

Array.prototype.mapPromise = async function (callback): Promise<Array<any>> {
  const that = <Array<any>>this
  for (let index = 0; index < that.length; index++) {
    that[index] = await callback(that[index], index, that)
  }
  return that
}

Array.prototype.cloneDeep = function () {
  // if (this.length && util.types.isProxy(this[0]) && this[0] instanceof BaseModel) {
  //   return this
  // }
  // return lodashCloneDeep(this)
  return this
}

Array.prototype.filterPromise = async function (callback): Promise<Array<any>> {
  const filtered: Array<any> = []
  for (let index = 0; index < this.length; index++) {
    const result = await callback(this[index], index, this)
    if (result) {
      filtered.push(this[index])
    }
  }
  return filtered
}

Array.prototype.flatToTreeView = function (childArrayKey: string, parentIdKey: string, primaryKey: string = 'id'): Array<any> {
  const array = this.cloneDeep()
  const hashed = array.reduce((acc, a) => {
    acc[a[primaryKey]] = a
    return acc
  }, {})
  const headNodes: number[] = []
  array.forEach((obj) => {
    if (obj[parentIdKey]) {
      hashed[obj[parentIdKey]][childArrayKey].push(obj)
    } else {
      headNodes.push(obj[primaryKey])
    }
  })
  return headNodes.sort().map((id) => hashed[id])
}

Array.prototype.treeToFlatView = function (childArrayKey: string, primaryKey: string = 'id'): any[] {
  const array = this.cloneDeep()
  const newArray: any[] = []
  array.forEach((t) => {
    if (t[childArrayKey] && t[childArrayKey].length > 0) {
      newArray.push(...t[childArrayKey].treeToFlatView(childArrayKey))
      t[childArrayKey] = []
    }
    newArray.push(t)
  })
  return newArray.sort((a, b) => a[primaryKey] - b[primaryKey])
}
