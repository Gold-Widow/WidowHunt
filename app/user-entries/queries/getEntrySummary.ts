import { Ctx, NotFoundError } from "blitz"
import db, { Role } from "db"
import { permsSchema } from "../validation"

export interface getEntryParams {
  id: string
}

export default async function getEntrySummary({ id }: getEntryParams, ctx: Ctx) {
  const entry = await db.userEntry.findUnique({
    where: { id },
    select: {
      id: true,
      ownerId: true,
      permissions: true,
      json: true,
    },
  })
  if (!entry) {
    throw new NotFoundError(`Entry with id ${id} not found`)
  }
  const perms = await permsSchema.parseAsync(entry?.permissions)

  if (ctx.session.userId === null || !perms.readUsers.includes(ctx.session.userId)) {
    ctx.session.$authorize(Role.ADMIN)
  }
  //@ts-ignore
  const title = entry.json["Title"] ?? "Untitled"
  //TODO: Swap out with the title key that the user may have customized
  //@ts-ignore
  delete entry.json
  return { ...entry, title }
}
