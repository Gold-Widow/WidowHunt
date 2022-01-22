import { resolver, Ctx, AuthorizationError } from "blitz"
import db, { Role } from "db"
import { getDefaultPermissionsForUser } from "../Permissions"
import { userEntry } from "../validation"

export default resolver.pipe(
  resolver.zod(userEntry.omit({ id: true, permissions: true })),
  resolver.authorize(),
  async ({ ownerId, yaml, json }, ctx: Ctx) => {
    if (ownerId !== ctx.session.userId) {
      ctx.session.$authorize(Role.ADMIN)
    }

    const entry = await db.userEntry.create({
      data: {
        yaml,
        json,
        ownerId,
        permissions: getDefaultPermissionsForUser(ownerId),
      },
    })

    return entry.id
  }
)
