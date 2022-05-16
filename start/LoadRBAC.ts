
import RolePermission from 'RBAC/RolePermission'
import PermissionFiles from 'RBAC/Permissions'
import RoleFiles from 'RBAC/Roles'

const fileName = s => `${__dirname}/.${s.replace('.ts', '')}`

PermissionFiles.forEach(async f => {
  const { default: arrOfObj } = await import(fileName(f))
  RolePermission.registerPermissions(...RolePermission.toPermissions(arrOfObj))
})

RoleFiles.forEach(async f => {
  const { default: arrOfObj } = await import(fileName(f))
  RolePermission.registerRoles(...RolePermission.toRoles(arrOfObj))
})
