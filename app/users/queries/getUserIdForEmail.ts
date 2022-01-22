import { resolver } from "blitz"
import db from "db"
import { FindUser } from "../validations"

export default resolver.pipe(resolver.zod(FindUser), resolver.authorize(), async ({ email }) => {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { email: true, id: true },
  })

  if (!user) {
    return null
  }

  return user
})
