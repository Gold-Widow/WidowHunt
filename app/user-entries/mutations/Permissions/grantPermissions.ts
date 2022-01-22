import { updatePerms } from "app/user-entries/logic/Permissions/updatePermission"
import { permsType } from "app/user-entries/Permissions"
import { grantEvent, permissionsType, permsSchema } from "app/user-entries/validation"
import { Ctx, NotFoundError, resolver } from "blitz"
import db, { Role } from "db"
import * as z from "zod"
import updatePermissions from "./updatePermissions"

export default resolver.pipe(
  resolver.zod(grantEvent),
  resolver.authorize(),
  async ({ entryId, grantingUserId, recipientId, permsType }, ctx: Ctx) => {
    if (grantingUserId !== ctx.session.userId) {
      ctx.session.$authorize(Role.ADMIN)
    }

    const grantingUser = await db.user.findUnique({
      where: { id: grantingUserId },
    })
    const receivingUser = await db.user.findUnique({
      where: { id: recipientId },
    })

    if (!grantingUser || !receivingUser) {
      throw new NotFoundError("Granting or receiving user not found")
    }

    const entry = await db.userEntry.findUnique({
      where: { id: entryId },
      select: { permissions: true, ownerId: true },
    })

    if (!entry) {
      throw new NotFoundError("Entry not found")
    }
    if (entry.ownerId !== ctx.session.userId) {
      ctx.session.$authorize(Role.ADMIN)
    }

    const currentPerms = await permsSchema.parseAsync(entry.permissions)

    // If not already in granted perms list of this user, add userid
    const updateNeeded = updatePerm(currentPerms, recipientId, permsType)
    console.log(updateNeeded)

    await db.userEntry.update({ where: { id: entryId }, data: { permissions: updateNeeded } })
  }
)

const updatePerm = (
  perms: permissionsType,
  userIdAdded: string,
  type: permsType
): permissionsType => {
  let arrayToUpdate: string[] = []
  switch (type as permsType) {
    case permsType.read:
      {
        console.log("Read")
        arrayToUpdate = perms.readUsers
      }
      break
    case permsType.write:
      {
        console.log("write")
        arrayToUpdate = perms.writeUsers
      }
      break
    case permsType.delete:
      {
        console.log("delete")
        arrayToUpdate = perms.deleteUsers
      }
      break
    default: {
    }
  }
  if (!arrayToUpdate.includes(userIdAdded)) {
    arrayToUpdate.push(userIdAdded)
  }
  return perms
}
