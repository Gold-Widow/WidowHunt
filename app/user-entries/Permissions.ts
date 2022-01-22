import { User } from "db"
import { permissionsType } from "./validation"

export enum permsType {
  read,
  write,
  delete,
}

export const DefaultPermissions: permissionsType = {
  publicRead: false,
  readUsers: [],

  publicWrite: false,
  writeUsers: [],

  deleteUsers: [],
}

export const getDefaultPermissionsForUser = (userId: User["id"]): permissionsType => {
  const defaults = { ...DefaultPermissions }

  defaults.readUsers.push(userId)
  defaults.writeUsers.push(userId)
  defaults.deleteUsers.push(userId)

  return defaults
}
