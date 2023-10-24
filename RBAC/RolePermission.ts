import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'

export enum PermissionEnum {
  None = 'none',
  Read = 'read',
  Write = 'write',
  All = 'all',
}

const canDoRead = (permission) => [PermissionEnum.Read, PermissionEnum.Write, PermissionEnum.All].includes(permission)
const canDoWrite = (permission) => [PermissionEnum.Write, PermissionEnum.All].includes(permission)
const canDoAll = (permission) => PermissionEnum.All === permission

const values = Object.values(PermissionEnum)
const defaultValue = PermissionEnum.None

export const Modules = {
  business_management: 'business_management', //done
  billing_management: 'billing_management', // payment controller available, rest not available
  user_role_management: 'user_role_management', //done
  workboard: 'workboard', // done
  drive: 'drive', // done
  clients: 'clients', // done
  invoices: 'invoices', //done
  loan_management: 'loan_management', // done
  dsc: 'dsc', //done
  deed: 'deed', // not available
}

const snakeToTitleCase = (str) =>
  str
    .split('_')
    .map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase())
    .join(' ')

export const Permissions = {
  [Modules.business_management]: {
    values,
    defaultValue,
    slug: Modules.business_management,
    display_name: snakeToTitleCase(Modules.business_management),
    desc: 'Manage the business and location',
  },
  [Modules.billing_management]: {
    values,
    defaultValue,
    slug: Modules.billing_management,
    display_name: snakeToTitleCase(Modules.billing_management),
    desc: 'Manage the business and location',
  },
  [Modules.user_role_management]: {
    values,
    defaultValue,
    slug: Modules.user_role_management,
    display_name: snakeToTitleCase(Modules.user_role_management),
    desc: 'Manage the users and roles',
  },
  [Modules.workboard]: {
    values,
    defaultValue,
    slug: Modules.workboard,
    display_name: snakeToTitleCase(Modules.workboard),
    desc: 'Manage the workboard, for the task related management workboard has own permissions',
  },
  [Modules.drive]: {
    values,
    defaultValue,
    slug: Modules.drive,
    display_name: snakeToTitleCase(Modules.drive),
    desc: 'Manage the drive module',
  },
  [Modules.clients]: {
    values,
    defaultValue,
    slug: Modules.clients,
    display_name: snakeToTitleCase(Modules.clients),
    desc: 'Manage the clients, groups and services',
  },
  [Modules.invoices]: {
    values,
    defaultValue,
    slug: Modules.invoices,
    display_name: snakeToTitleCase(Modules.invoices),
    desc: 'Manage the invoices and firms',
  },
  [Modules.loan_management]: {
    values,
    defaultValue,
    slug: Modules.loan_management,
    display_name: snakeToTitleCase(Modules.loan_management),
    desc: 'Manage the home loan, LAP, Cash Credit, Project loan (Finance section)',
  },
  [Modules.dsc]: {
    values,
    defaultValue,
    slug: Modules.dsc,
    display_name: snakeToTitleCase(Modules.dsc),
    desc: 'Manage the DSC',
  },
  [Modules.deed]: {
    values,
    defaultValue,
    slug: Modules.deed,
    display_name: snakeToTitleCase(Modules.deed),
    desc: 'Manage the Deeds',
  },
}

/**
 * decorator function for controllers as @can(<Permission.access>)
 *
 * @can('locations.read')
 * public async index(ctx: HttpContextContract) {
 *  // permissions already being checked
 *  // Do some code here...
 * }
 */
export const can = function (access: string, message: string = "You don't have permission to access the resource") {
  return function (_0: any, _1: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value
    if (typeof fn == 'function') {
      descriptor.value = function (ctx: HttpContextContract) {
        if (ctx.access?.canAccessToBranch(ctx.branch.id) && checkForRole(access, ctx.access.role)) {
          return fn.call(this, ctx)
        }
        return ctx.response.status(403).json({ message })
      }
    }
    return descriptor
  }
}

const checkForRole = function (accessFor: string, role: Role) {
  if (role.permissions) {
    const [resource, permission] = accessFor.split('.') //clients.read => resource=clients, permission=read
    const grantPermission = role.permissions[resource]
    if (!grantPermission) return false

    switch (permission) {
      case PermissionEnum.Read:
      case 'index':
      case 'show':
        return canDoRead(grantPermission)
      case PermissionEnum.Write:
      case 'store':
      case 'update':
        return canDoWrite(grantPermission)
      case PermissionEnum.All:
      case 'destroy':
        return canDoAll(grantPermission)
    }
    return false
  }
  return true
}
