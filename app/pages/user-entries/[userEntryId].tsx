import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUserEntry from "app/user-entries/queries/getUserEntry"
import deleteUserEntry from "app/user-entries/mutations/deleteUserEntry"

export const UserEntry = () => {
  const router = useRouter()
  const userEntryId = useParam("userEntryId", "number")
  const [deleteUserEntryMutation] = useMutation(deleteUserEntry)
  // const [userEntry] = useQuery(getUserEntry, { id: userEntryId })

  return (
    <>
      <Head>
        {/* <title>UserEntry {userEntry.id}</title> */}
      </Head>

      <div>
        {/* <h1>UserEntry {userEntry.id}</h1> */}
        {/* <pre>{JSON.stringify(userEntry, null, 2)}</pre> */}

        {/* <Link href={`/userEntries/${userEntry.id}/edit`}>
          <a>Edit</a>
        </Link> */}

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              // await deleteUserEntryMutation({ id: userEntry.id })
              router.push("/userEntries")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowUserEntryPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/userEntries">
          <a>UserEntries</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <UserEntry />
      </Suspense>
    </div>
  )
}

ShowUserEntryPage.authenticate = true
ShowUserEntryPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowUserEntryPage
