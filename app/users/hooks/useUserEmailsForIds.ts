import { useQuery } from "blitz"
import getUserEntries, { GetUserEntriesInput } from "app/user-entries/queries/getUserEntries"
import { User } from "db"
import getUserEmailsForIds from "../queries/getUserEmailsForIds"

export const useUserEmailsForIds = (userIds: User["id"][]) => {
  const [queryResult] = useQuery(getUserEmailsForIds, { userIds })
  return queryResult
}
