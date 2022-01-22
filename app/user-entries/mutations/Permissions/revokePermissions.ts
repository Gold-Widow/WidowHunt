import { updatePerms } from "app/user-entries/logic/Permissions/updatePermission"
import { permsType } from "app/user-entries/Permissions"
import { revokeEvent, permissionsType, permsSchema } from "app/user-entries/validation"
import { Ctx, NotFoundError, resolver } from "blitz"
import db, { Role } from "db"

export default resolver.pipe(
  resolver.zod(revokeEvent),
  resolver.authorize(),
  async ({ entryId, grantingUserId, revokedId, permsType }, ctx: Ctx) => {
    if (grantingUserId !== ctx.session.userId) {
      ctx.session.$authorize(Role.ADMIN)
    }

    const grantingUser = await db.user.findUnique({
      where: { id: grantingUserId },
    })

    if (!grantingUser) {
      throw new NotFoundError("Granting user not found")
    }

    const entry = await db.userEntry.findUnique({
      where: { id: entryId },
      select: { permissions: true, ownerId: true },
    })
    if (!entry) {
      throw new NotFoundError("Entry not found")
    }

    const currentPerms = await permsSchema.parseAsync(entry.permissions)

    if (revokedId === entry.ownerId) {
      throw new Error("Cannot revoke permissions for owner")
    }
    const updateNeeded = revokePerm(currentPerms, revokedId, permsType)

    await db.userEntry.update({ where: { id: entryId }, data: { permissions: updateNeeded } })
  }
)

const revokePerm = (
  perms: permissionsType,
  userIdRemoved: string,
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
  arrayToUpdate = arrayToUpdate.filter((id) => id !== userIdRemoved)
  switch (type as permsType) {
    case permsType.read:
      {
        console.log("Read")
        perms.readUsers = arrayToUpdate
      }
      break
    case permsType.write:
      {
        console.log("write")
        perms.writeUsers = arrayToUpdate
      }
      break
    case permsType.delete:
      {
        console.log("delete")
        perms.deleteUsers = arrayToUpdate
      }
      break
    default: {
    }
  }
  return perms
}
