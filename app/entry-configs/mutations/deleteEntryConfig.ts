import { resolver, Ctx } from "blitz"
import db, { Role } from "db"
import * as z from "zod"
import getEntryConfigForUser from "../queries/getEntryConfigForUser"

const DeleteEntryConfig = z
  .object({
    id: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(DeleteEntryConfig),
  resolver.authorize(),
  async ({ id }, ctx: Ctx) => {
    const userConfig = await getEntryConfigForUser({ userId: ctx.session.userId ?? "" }, ctx)

    if (!userConfig || userConfig.id !== id) {
      ctx.session.$authorize(Role.ADMIN)
    }

    const entryConfig = await db.entryConfig.deleteMany({ where: { id } })

    return entryConfig
  }
)
