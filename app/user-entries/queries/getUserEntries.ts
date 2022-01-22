import { Ctx, paginate, resolver } from "blitz"
import db, { Prisma } from "db"

export interface GetUserEntriesInput
  extends Pick<Prisma.userEntryFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: GetUserEntriesInput, ctx: Ctx) => {
    // Don't allow any funny business, ownerId hardcoded to belong to this user for now
    where = { ...where, ownerId: ctx.session.userId ?? undefined }
    console.log(where)
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: userEntries, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.userEntry.count({ where: where }),
      query: (paginateArgs) =>
        db.userEntry.findMany({
          ...paginateArgs,
          where,
          orderBy,
          select: {
            id: true,
            ownerId: true,
            createdAt: true,
            json: true,
          },
        }),
    })

    return {
      userEntries,
      nextPage,
      hasMore,
      count,
    }
  }
)
