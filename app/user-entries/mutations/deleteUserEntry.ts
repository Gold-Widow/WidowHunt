import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteUserEntry = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(DeleteUserEntry),
  resolver.authorize(),
  async ({ id }) => {
    throw new Error("not implemented");

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // const userEntry = await db.userEntry.deleteMany({ where: { id } })

    // return userEntry
  }
)
