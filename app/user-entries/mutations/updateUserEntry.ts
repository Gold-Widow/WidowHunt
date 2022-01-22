import { resolver, Ctx, AuthorizationError, NotFoundError } from "blitz"
import db, { Role } from "db"
import { permsSchema, userEntry } from "app/user-entries/validation"
import * as z from "zod"

const userEntrySchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  yaml: z.string(),
  json: z.any(),
})

export default resolver.pipe(
  resolver.zod(userEntrySchema),
  async ({ id, ownerId, yaml, json }, ctx: Ctx) => {
    const entry = await db.userEntry.findUnique({
      where: { id },
      select: { permissions: true, ownerId: true },
    })

    if (!entry) {
      throw new NotFoundError(`Entry id ${id} was not found`)
    }

    const currentPerms = await permsSchema.parseAsync(entry.permissions)

    if (!currentPerms.publicWrite && !currentPerms.writeUsers.includes(ctx.session.userId ?? "")) {
      ctx.session.$authorize(Role.ADMIN)
    }

    await db.userEntry.update({
      where: { id },
      data: {
        yaml: yaml,
        json: json,
      },
    })
  }
)
