// import { Modules, PermissionEnum } from 'RBAC/RolePermission'

// export const RoleNameOwner = 'Owner'
// export const RoleNameAdmin = 'Admin'
// export const RoleNameManager = 'Manager'
// export const RoleNameEmployee = 'Employee'
// export const RoleNameIntern = 'Intern'

// const permissionOptions = {
//   [Modules.business_management]: PermissionEnum.None,
//   [Modules.billing_management]: PermissionEnum.None,
//   [Modules.user_role_management]: PermissionEnum.Read,
// }

// const setPermission = (permission, options = {}) => {
//   options = { ...permissionOptions, ...options }
//   const modules = Object.values(Modules)
//   return modules.reduce((h, m) => {
//     switch (m) {
//       case Modules.business_management:
//         h[m] = options[Modules.business_management]
//         break
//       case Modules.billing_management:
//         h[m] = options[Modules.billing_management]
//         break
//       case Modules.user_role_management:
//         h[m] = options[Modules.user_role_management]
//         break
//       default:
//         h[m] = permission
//     }
//     return h
//   }, {})
// }

// export default [
//   {
//     name: RoleNameOwner,
//     permissions: null,
//     restricted: true,
//   },
//   {
//     name: RoleNameAdmin,
//     permissions: setPermission(PermissionEnum.All, {
//       [Modules.business_management]: PermissionEnum.Read,
//       [Modules.billing_management]: PermissionEnum.Read,
//       [Modules.user_role_management]: PermissionEnum.Write,
//     }),
//     restricted: false,
//   },
//   {
//     name: RoleNameManager,
//     permissions: setPermission(PermissionEnum.All, {
//       [Modules.business_management]: PermissionEnum.Read,
//     }),
//     restricted: false,
//   },
//   {
//     name: RoleNameEmployee,
//     permissions: setPermission(PermissionEnum.Write),
//     restricted: false,
//   },
//   {
//     name: RoleNameIntern,
//     permissions: setPermission(PermissionEnum.Read, {
//       [Modules.user_role_management]: PermissionEnum.None,
//     }),
//     restricted: false,
//   },
// ]
