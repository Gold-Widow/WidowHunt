import { useQuery } from "blitz"
import getUserEntries, { GetUserEntriesInput } from "app/user-entries/queries/getUserEntries"

export const useEntries = (
  params: GetUserEntriesInput
) => {
  const [queryResult] = useQuery(getUserEntries, params)
  return queryResult
}
