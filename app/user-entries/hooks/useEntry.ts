import { useQuery } from "blitz"
import getEntry, { getEntryParams } from "app/user-entries/queries/getUserEntry"

export const useEntry = (
  id: string,
  returnNullIfNotFound?: boolean,
  returnNullIfNotAuthorized?: boolean
) => {
  const params: getEntryParams = {
    id,
    returnNullIfNotFound: returnNullIfNotFound ?? false,
    returnNullIfNotAuthorized: returnNullIfNotAuthorized ?? false,
  }
  const [queryResult, { refetch }] = useQuery(getEntry, params)
  return { ...queryResult, refetch: refetch }
}
