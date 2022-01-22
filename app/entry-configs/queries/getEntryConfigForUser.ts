import { resolver, NotFoundError, Ctx } from "blitz"
import db, { Role, configType } from "db"
import * as z from "zod"

const GetEntryConfig = z.object({
  // This accepts type of undefined, but is required at runtime
  userId: z.string(),
})

export default resolver.pipe(resolver.zod(GetEntryConfig), async ({ userId }, ctx: Ctx) => {
  if (!userId || userId.length === 0) {
    return await db.entryConfig.findFirst({ where: { type: configType.SYSTEM_DEFAULT } })
  }

  if (userId !== ctx.session.userId) {
    ctx.session.$authorize(Role.ADMIN)
  }

  return (
    (await db.entryConfig.findFirst({ where: { ownerId: userId } })) ??
    (await db.entryConfig.findFirst({ where: { type: configType.SYSTEM_DEFAULT } }))
  )
})
