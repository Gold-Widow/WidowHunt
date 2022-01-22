import { permissionsType } from "app/user-entries/validation"
import { AuthorizationError, NotFoundError } from "blitz"
import db, { Role, User, userEntry } from "db"

export const updatePerms = async (
  id: userEntry["id"],
  updatingUser: User["id"],
  perms: permissionsType,
  ignoreAuthCheck?: false
) => {
  const entryToUpdate = await db.userEntry.findUnique({ where: { id } })
  if (!entryToUpdate) {
    throw new NotFoundError()
  }

  if (entryToUpdate.ownerId !== updatingUser && !ignoreAuthCheck) {
    throw new AuthorizationError()
  }

  await db.userEntry.update({ where: { id }, data: { permissions: perms } })
}
