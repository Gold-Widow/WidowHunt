import { useQuery } from "blitz"
import getEntryConfigForUser from "app/entry-configs/queries/getEntryConfigForUser"

export const useUserConfig = (params: { userId: string }) => {
  const [queryResult] = useQuery(getEntryConfigForUser, params)
  return queryResult
}
