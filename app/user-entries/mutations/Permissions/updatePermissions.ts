import { Ctx, NotFoundError, resolver } from "blitz"
import { permsSchema } from "../../validation"
import * as z from "zod"
import db, { Role, userEntry } from "db"
import { updatePerms } from "app/user-entries/logic/Permissions/updatePermission"

const permsAndIdScheme = permsSchema.extend({ id: z.string() })

export default resolver.pipe(
  resolver.zod(permsAndIdScheme),
  resolver.authorize(),
  async ({ id, ...perms }, ctx: Ctx) => {
    updatePerms(id, ctx.session.userId ?? "", perms)
  }
)
