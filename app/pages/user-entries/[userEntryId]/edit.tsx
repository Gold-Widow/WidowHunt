import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUserEntry from "app/user-entries/queries/getUserEntry"
import updateUserEntry from "app/user-entries/mutations/updateUserEntry"
import { UserEntryForm, FORM_ERROR } from "app/user-entries/components/UserEntryForm"

export const EditUserEntry = () => {
  const router = useRouter()
  const userEntryId = useParam("userEntryId", "number")
  // const [userEntry, { setQueryData }] = useQuery(getUserEntry, { id: userEntryId })
  const [updateUserEntryMutation] = useMutation(updateUserEntry)

  return (
    <>
      <Head>
        {/* <title>Edit UserEntry {userEntry.id}</title> */}
      </Head>

      <div>
        {/* <h1>Edit UserEntry {userEntry.id}</h1> */}
        {/* <pre>{JSON.stringify(userEntry)}</pre> */}

        <UserEntryForm
          submitText="Update UserEntry"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateUserEntry}
          // initialValues={userEntry}
          onSubmit={async (values) => {
            try {
              const updated = await updateUserEntryMutation({
                // id: userEntry.id,
                ...values,
              })
              // await setQueryData(updated)
              // router.push(`/userEntries/${updated.id}`)
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditUserEntryPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditUserEntry />
      </Suspense>

      <p>
        <Link href="/userEntries">
          <a>UserEntries</a>
        </Link>
      </p>
    </div>
  )
}

EditUserEntryPage.authenticate = true
EditUserEntryPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditUserEntryPage
