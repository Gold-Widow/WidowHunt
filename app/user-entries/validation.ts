import * as z from "zod"
import { permsType } from "./Permissions"

export const permsSchema = z.object({
  publicRead: z.boolean(),
  readUsers: z.array(z.string()),

  publicWrite: z.boolean(),
  writeUsers: z.array(z.string()),

  deleteUsers: z.array(z.string()),
})

export const userEntry = z.object({
  id: z.string().uuid(),
  yaml: z.string(),
  json: z.any(),
  ownerId: z.string().uuid(),
  permissions: permsSchema,
})

export const grantEvent = z.object({
  entryId: z.string(),
  grantingUserId: z.string(),
  recipientId: z.string(),
  permsType: z.nativeEnum(permsType),
})

export const revokeEvent = z.object({
  entryId: z.string(),
  grantingUserId: z.string(),
  revokedId: z.string(),
  permsType: z.nativeEnum(permsType),
})

export type grantEventType = z.infer<typeof grantEvent>

export type permissionsType = z.infer<typeof permsSchema>
