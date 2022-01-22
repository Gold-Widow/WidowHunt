import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createUserEntry from "app/user-entries/mutations/createUserEntry"
import { UserEntryForm, FORM_ERROR } from "app/user-entries/components/UserEntryForm"

const NewUserEntryPage: BlitzPage = () => {
  const router = useRouter()
  const [createUserEntryMutation] = useMutation(createUserEntry)

  return (
    <div>
      <h1>Create New UserEntry</h1>

      <UserEntryForm
        submitText="Create UserEntry"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateUserEntry}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const userEntry = await createUserEntryMutation(values)
            // router.push(`/userEntries/${userEntry.id}`)
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href="/userEntries">
          <a>UserEntries</a>
        </Link>
      </p>
    </div>
  )
}

NewUserEntryPage.authenticate = true
NewUserEntryPage.getLayout = (page) => <Layout title={"Create New UserEntry"}>{page}</Layout>

export default NewUserEntryPage
