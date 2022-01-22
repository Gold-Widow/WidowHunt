import LabeledTextField from "app/core/components/LabeledTextField"
import { useEntrySummary } from "app/user-entries/hooks/useEntrySummary"
import { grantEventType, permsSchema } from "app/user-entries/validation"
import { User, userEntry } from "db"
import { FC, useState } from "react"
import { PermittedUsersTable } from "./PermittedUsersTable"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { FindUser } from "app/users/validations"
import { invoke, useMutation } from "blitz"
import getUserIdForEmail from "app/users/queries/getUserIdForEmail"
import grantPermissions from "app/user-entries/mutations/Permissions/grantPermissions"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { permsType } from "app/user-entries/Permissions"
import { MutateFunction } from "@blitzjs/core/dist/declarations/src/use-mutation"
import toast from "react-hot-toast"
import revokePermissions from "app/user-entries/mutations/Permissions/revokePermissions"
import togglePermission from "app/user-entries/mutations/Permissions/togglePermission"

export const PermissionsCard: FC<{ entryId: userEntry["id"] }> = ({ entryId }) => {
  const user = useCurrentUser()
  const [summary, { refetch }] = useEntrySummary(entryId)
  const perms = permsSchema.parse(summary.permissions)
  const [newViewUser, setNewViewUser] = useState("")
  const [grantPermsMutation] = useMutation(grantPermissions)
  const [togglePermsMutation] = useMutation(togglePermission)

  return (
    <div className="row">
      <div className="col">
        <h5>Title:</h5> {summary.title}
        <ul className="nav nav-tabs mb-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className="nav-link active"
              id="ex1-tab-1"
              data-mdb-toggle="tab"
              href="#ex1-tabs-1"
              role="tab"
              aria-controls="ex1-tabs-1"
              aria-selected="true"
            >
              View
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link"
              id="ex1-tab-2"
              data-mdb-toggle="tab"
              href="#ex1-tabs-2"
              role="tab"
              aria-controls="ex1-tabs-2"
              aria-selected="false"
            >
              Edit
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className="nav-link"
              id="ex1-tab-3"
              data-mdb-toggle="tab"
              href="#ex1-tabs-3"
              role="tab"
              aria-controls="ex1-tabs-3"
              aria-selected="false"
            >
              Delete
            </a>
          </li>
        </ul>
        <div className="tab-content" id="ex1-content">
          <div
            className="tab-pane fade show active"
            id="ex1-tabs-1"
            role="tabpanel"
            aria-labelledby="ex1-tab-1"
          >
            {!perms.publicRead && (
              <a
                role="button"
                className="link-primary"
                onClick={async () => {
                  await togglePermsMutation({
                    entryId,
                    permsType: permsType.read,
                    makePublic: true,
                  })
                  await refetch()
                  toast.success("View permissions updated")
                }}
              >
                Make publicly viewable
              </a>
            )}
            {perms.publicRead && (
              <a
                role="button"
                className="link-primary"
                onClick={async () => {
                  await togglePermsMutation({
                    entryId,
                    permsType: permsType.read,
                    makePublic: false,
                  })
                  await refetch()
                  toast.success("View permissions updated")
                }}
              >
                Make privately viewable
              </a>
            )}
            <br />
            {!perms.publicRead && (
              <>
                <a
                  type="button"
                  className="link-primary"
                  data-mdb-toggle="collapse"
                  href="#Add-View-User"
                  role="button"
                  aria-expanded="false"
                  aria-controls="Add-View-User"
                >
                  <em>Add a user with view permissions</em>
                </a>
                <br />
                <div className="collapse mt-3" id="Add-View-User">
                  <Form
                    schema={FindUser}
                    onSubmit={async (values) =>
                      await permsOnSubmit(
                        permsType.read,
                        values.email,
                        user?.id ?? "",
                        entryId,
                        grantPermsMutation,
                        refetch
                      )
                    }
                    submitText="Add User"
                  >
                    <LabeledTextField label="User email" name="email" />
                  </Form>
                </div>
                <PermittedUsersTable
                  userIds={perms.readUsers}
                  title="These users can view this entry"
                  permType={permsType.read}
                  entryId={entryId}
                  refetch={refetch}
                />
              </>
            )}
            {perms.publicRead && "Public - anyone can view this entry"}
          </div>
          <div
            className="tab-pane fade"
            id="ex1-tabs-2"
            role="tabpanel"
            aria-labelledby="ex1-tab-2"
          >
            {/* {!perms.publicWrite && (
              <a
                role="button"
                className="link-primary"
                onClick={async () => {
                  await togglePermsMutation({
                    entryId,
                    permsType: permsType.write,
                    makePublic: true,
                  })
                  await refetch()
                  toast.success("Edit permissions updated")
                }}
              >
                Make publicly editable
              </a>
            )} */}
            {/* {perms.publicWrite && (
              <a
                role="button"
                className="link-primary"
                onClick={async () => {
                  await togglePermsMutation({
                    entryId,
                    permsType: permsType.write,
                    makePublic: false,
                  })
                  await refetch()
                  toast.success("Edit permissions updated")
                }}
              >
                Make privately editable
              </a>
            )} */}
            <br />
            {!perms.publicWrite && (
              <>
                <a
                  type="button"
                  className="link-primary"
                  data-mdb-toggle="collapse"
                  href="#Add-Edit-User"
                  role="button"
                  aria-expanded="false"
                  aria-controls="Add-Edit-User"
                >
                  <em>Add a user with Edit permissions</em>
                </a>
                <br />
                <div className="collapse mt-3" id="Add-Edit-User">
                  <Form
                    schema={FindUser}
                    onSubmit={async (values) =>
                      await permsOnSubmit(
                        permsType.write,
                        values.email,
                        user?.id ?? "",
                        entryId,
                        grantPermsMutation,
                        refetch
                      )
                    }
                    submitText="Add User"
                  >
                    <LabeledTextField label="User email" name="email" />
                  </Form>
                </div>
                <PermittedUsersTable
                  userIds={perms.writeUsers}
                  title="These users can edit this entry"
                  permType={permsType.read}
                  entryId={entryId}
                  refetch={refetch}
                />
              </>
            )}
            {perms.publicWrite && "Public - anyone can edit this entry"}
          </div>
          <div
            className="tab-pane fade"
            id="ex1-tabs-3"
            role="tabpanel"
            aria-labelledby="ex1-tab-3"
          >
            <a
              type="button"
              className="link-primary"
              data-mdb-toggle="collapse"
              href="#Add-Delete-User"
              role="button"
              aria-expanded="false"
              aria-controls="Add-Delete-User"
            >
              <em>Add a user with Delete permissions</em>
            </a>
            <br />
            <div className="collapse mt-3" id="Add-Delete-User">
              <Form
                schema={FindUser}
                onSubmit={async (values) =>
                  await permsOnSubmit(
                    permsType.delete,
                    values.email,
                    user?.id ?? "",
                    entryId,
                    grantPermsMutation,
                    refetch
                  )
                }
                submitText="Add User"
              >
                <LabeledTextField label="User email" name="email" />
              </Form>
            </div>
            <PermittedUsersTable
              userIds={perms.deleteUsers}
              title="These users can delete this entry"
              permType={permsType.delete}
              entryId={entryId}
              refetch={refetch}
            />
          </div>
        </div>
        <hr />
        <em>Note: Currently, only the owner can edit an entry's permissions.</em>
        <br />
        Entry ID: {summary.id}
        <br />
        {/* // Add toggle to make permissions private */}
      </div>
    </div>
  )
}
const permsOnSubmit = async (
  permType: permsType,
  email: string,
  userId: User["id"],
  entryId: userEntry["id"],
  grantPermsMutation: MutateFunction<void, unknown, grantEventType, unknown>,
  refetch: any
) => {
  try {
    const foundUser = await invoke(getUserIdForEmail, { email: email })
    if (!foundUser) {
      return {
        [FORM_ERROR]: `${email} was not found. Please invite the user to join the application and retry`,
      }
    }
    await grantPermsMutation({
      entryId,
      grantingUserId: userId,
      permsType: permType,
      recipientId: foundUser.id,
    })
    await refetch()
    toast.success(`Permissions granted to ${foundUser.email}`)
  } catch (error) {
    return {
      [FORM_ERROR]: `An error occurred when granting permission`,
    }
  }
}
