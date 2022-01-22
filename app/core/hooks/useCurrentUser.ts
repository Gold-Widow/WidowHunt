import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { Role } from "db"

export type currentUserType = {
  role: Role
  id: string
  name: string | null
  email: string
} | null

export const useCurrentUser = (): currentUserType => {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
