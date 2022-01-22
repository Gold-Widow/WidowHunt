import { configBuilder } from "app/user-entries/SystemConfig"
import { resolver, Ctx } from "blitz"
import db, { configType } from "db"
import * as z from "zod"

const CreateEntryConfig = z
  .object({
    titleKey: z.string().min(1).max(50).optional(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(CreateEntryConfig),
  resolver.authorize(),
  async (input, ctx: Ctx) => {
    const confBuilder = new configBuilder()
    const json = (input.titleKey
      ? confBuilder.useTitleKey(input.titleKey).config
      : confBuilder.config) as any

    if (await db.entryConfig.findFirst({ where: { ownerId: ctx.session.userId } })) {
      throw new Error(`User id ${ctx.session.userId} already has a entry configuration`)
    }

    const entryConfig = await db.entryConfig.create({
      data: {
        type: configType.USER_CONFIG,
        json,
        ownerId: ctx.session.userId,
      },
    })

    return entryConfig
  }
)
