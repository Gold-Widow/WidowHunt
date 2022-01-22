import LabeledTextField from "app/core/components/LabeledTextField"
import Form from "app/core/components/Form"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useUserConfig } from "app/entry-configs/hooks/useUserConfig"
import { Link, usePaginatedQuery } from "blitz"
import { Prisma } from "db"
import { Dispatch, SetStateAction, useState } from "react"
import getUserEntries from "../queries/getUserEntries"
import { systemConfigJson } from "../SystemConfig"
import { PermsBtnModal } from "./Permissions/PermsBtnModal"
import { TitleFilter } from "./TitleFilter"

type filterState = [
  Prisma.userEntryWhereInput,
  Dispatch<SetStateAction<Prisma.userEntryWhereInput>>
]

export const EntriesTable = () => {
  const user = useCurrentUser()
  const configObject = useUserConfig({ userId: user?.id ?? "" })
  const config = configObject ? configObject.json : undefined
  const titleKey = config ? ((config as unknown) as systemConfigJson).titleKey : undefined

  const [filters, setFilters]: filterState = useState({})

  const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(10)
  const [currentPage, updateCurrentPage] = useState(1)

  const [{ userEntries, hasMore, count }] = usePaginatedQuery(getUserEntries, {
    where: filters,
    orderBy: { createdAt: "asc" },
    skip: ITEMS_PER_PAGE * (currentPage - 1),
    take: ITEMS_PER_PAGE,
  })

  if (!user) {
    return (
      <div className="text-center">
        <strong>Log in to view your entries</strong>
      </div>
    )
  }
  return (
    <div className="row">
      <div className="col">
        <div className="row">
          <div className="col-8 mx-auto mx-md-0 col-md-6">
            <TitleFilter
              onChange={(val) => {
                setFilters((prev) => {
                  return { ...prev, json: { path: ["Title"], string_contains: val } } //TODO: Check this user's config to ensure key is right
                })
              }}
            />
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Id</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{getTitleForEntry(entry.json, titleKey)}</td>
                <td>{entry.id}</td>
                <td>
                  <Link href={`/user-entries?entryId=${entry.id}`}>
                    <button className="btn btn-warning btn-sm">Open</button>
                  </Link>
                  <PermsBtnModal entryId={entry.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-100"></div>
      <div className="col">
        <div className="row">
          <div className="col-auto">
            Page {currentPage} of {Math.ceil(count / ITEMS_PER_PAGE)}
          </div>
          <div className="col-auto">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => updateCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => updateCurrentPage((prev) => prev + 1)}
              disabled={!hasMore}
            >
              Next
            </button>
          </div>
          <div className="col-auto my-auto ms-auto">Results per page</div>
          <div className="col-auto" style={{ width: "6rem" }}>
            <Form onSubmit={() => {}}>
              <LabeledTextField
                type="number"
                onChange={(evt) => setITEMS_PER_PAGE(Number(evt.target.value))}
                label={""}
                name="results-per-page-input"
                value={ITEMS_PER_PAGE}
              />
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

const getTitleForEntry = (entry, titleKey) => {
  var title = entry[titleKey]
  if (!title) {
    return "Untitled"
  }
  return title
}
