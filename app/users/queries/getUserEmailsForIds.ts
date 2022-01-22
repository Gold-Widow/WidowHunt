import { Ctx, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const emailsToIdsSchema = z.object({
  userIds: z.array(z.string()),
})

export default resolver.pipe(
  resolver.zod(emailsToIdsSchema),
  resolver.authorize(),
  async ({ userIds }) => {
    const emails = await db.user.findMany({
      where: { OR: userIds.map((id) => ({ id })) },
      select: { id: true, email: true },
    })
    return emails
  }
)
