import { useQuery } from "blitz"
import getEntry, { getEntryParams } from "app/user-entries/queries/getUserEntry"
import getEntrySummary from "../queries/getEntrySummary"
import { EntryConfig } from "db"

export const useEntrySummary = (id: EntryConfig["id"]) => {
  return useQuery(getEntrySummary, { id })
}
