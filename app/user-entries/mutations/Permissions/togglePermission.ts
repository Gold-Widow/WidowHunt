import { updatePerms } from "app/user-entries/logic/Permissions/updatePermission"
import { permsType } from "app/user-entries/Permissions"
import { grantEvent, permissionsType, permsSchema, userEntry } from "app/user-entries/validation"
import { Ctx, NotFoundError, resolver } from "blitz"
import db, { Role } from "db"
import * as z from "zod"
import updatePermissions from "./updatePermissions"

const togglePermSchema = z.object({
  entryId: z.string(),
  permsType: z.nativeEnum(permsType),
  makePublic: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(togglePermSchema),
  resolver.authorize(),
  async ({ entryId, makePublic, permsType }, ctx: Ctx) => {
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
    const updateNeeded = updatePerm(currentPerms, permsType, makePublic)

    await db.userEntry.update({ where: { id: entryId }, data: { permissions: updateNeeded } })
  }
)

const updatePerm = (
  perms: permissionsType,
  type: permsType,
  makePublic: boolean
): permissionsType => {
  let arrayToUpdate: string[] = []
  switch (type as permsType) {
    case permsType.read:
      {
        console.log("Read")
        perms.publicRead = makePublic
      }
      break
    case permsType.write:
      {
        console.log("write")
        perms.publicWrite = makePublic
      }
      break
    default: {
    }
  }
  return perms
}
