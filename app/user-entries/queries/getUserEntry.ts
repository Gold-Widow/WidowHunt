import { Ctx, NotFoundError } from "blitz"
import db, { Role } from "db"
import { permsSchema } from "../validation"

export interface getEntryParams {
  id: string
  returnNullIfNotFound: boolean
  returnNullIfNotAuthorized: boolean
}

export default async function getEntry(
  { id, returnNullIfNotFound, returnNullIfNotAuthorized }: getEntryParams,
  ctx: Ctx
) {
  if ((!id || id.length === 0) && returnNullIfNotAuthorized) {
    return null
  }

  const entry = await db.userEntry.findUnique({
    where: { id },
  })

  if (!entry) {
    if (returnNullIfNotFound) {
      return null
    }
    throw new NotFoundError(`Issue id ${id} not in database`)
  }

  const currentPerms = await permsSchema.parseAsync(entry.permissions)
  if (!currentPerms.publicRead && !currentPerms.readUsers.includes(ctx.session.userId ?? "")) {
    ctx.session.$authorize(Role.ADMIN)
  }

  return entry
}
