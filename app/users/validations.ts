import * as z from "zod"

export const FindUser = z.object({
  email: z.string().email(),
})
