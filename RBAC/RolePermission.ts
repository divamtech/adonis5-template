import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transform from 'App/Utils/Transform'

class Permission extends Transform {
  constructor(public name: string, public desc: string, public access: string) {
    super()
  }
}

class Role extends Transform {
  private _accesses: string = ''
  constructor(
    public name: string,
    public desc: string,
    public slug: string,
    public permissions: Array<Permission> | string,
    public others: any = '*') {
    super()
    if (typeof (this.permissions) == 'string') {
      this._accesses = '*'
    } else {
      this._accesses = this.permissions.map(p => p.access).join()
    }
  }

  accesses() {
    return this._accesses
  }

  can(access: string): boolean {
    if (typeof (this.permissions) == 'string') {
      return this.permissions == '*'
    } else {
      if (access.endsWith(".*")) {
        access = access.replace(".*", ".index")
      }
      return this.permissions.some(p => p.access == access)
    }
  }
}

class RolePermission extends Transform {
  private rolesHash = {}
  private permissionsHash = {}

  registerRoles(...roles: Role[]) {
    roles.forEach(role => (this.rolesHash[role.slug] = role))
    return this
  }

  registerPermissions(...permissions: Permission[]) {
    permissions.forEach(permission => (this.permissionsHash[permission.access] = permission))
    return this
  }

  roles(): Role[] {
    return Object.values(this.rolesHash)
  }

  permissions(): Permission[] {
    return Object.values(this.permissionsHash)
  }

  findRole(slug: string): Role | null {
    return this.rolesHash[slug]
  }

  findPermission(access: string): Permission | null {
    return this.permissionsHash[access]
  }

  toRoles(arrOfObj: Array<any>): Array<Role> {
    return arrOfObj.map((o) => {
      o.permissions = typeof o.permissions == 'string' ? o.permissions : this.toPermissions(o.permissions)
      return new (<any>Role)(...Object.values(o))
    })
  }

  toPermissions(arrOfObj: Array<any>): Array<Permission> {
    return arrOfObj.map((o) => new (<any>Permission)(...Object.values(o)))
  }

  can(roles: Role[] | string, access: string): boolean {
    if (typeof (roles) == 'string') {
      return roles == '*'
    }
    return roles.some(r => r.can(access))
  }
}
const rolePermissionSingleton = new RolePermission()

/**
 * decorator function for controllers as @can(<Permission.access>)
 *
 * @can('locations.index')
 * public async index(ctx: HttpContextContract) {
 *  // permissions already being checked
 *  // Do some code here...
 * }
*/
const can = function (access: string, message: string = "You don't have permission to access the resource") {
  return function (_0: any, _1: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value
    if (typeof fn == 'function') {
      descriptor.value = function (ctx: HttpContextContract) {
        if (!ctx.access || !ctx.access.can(access)) {
          return ctx.response.status(403).json({ message })
        }
        return fn.call(this, ctx)
      }
    }
    return descriptor
  }
}


export default rolePermissionSingleton
export { Role, Permission, can }
