import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import revokePermissions from "app/user-entries/mutations/Permissions/revokePermissions"
import { permsType } from "app/user-entries/Permissions"
import { useUserEmailsForIds } from "app/users/hooks/useUserEmailsForIds"
import { useMutation } from "blitz"
import { User, userEntry } from "db"
import { FC } from "react"
import toast from "react-hot-toast"

export const PermittedUsersTable: FC<{
  userIds: User["id"][]
  title: string
  permType: permsType
  entryId: userEntry["id"]
  refetch: any
}> = ({ userIds, title, entryId, permType, refetch }) => {
  const user = useCurrentUser()
  const userEmails = useUserEmailsForIds(userIds)
  const [revokeMutation] = useMutation(revokePermissions)

  return (
    <>
      <b>{title}</b>
      {userEmails.map((email) => (
        <>
          <div className="row">
            <div className="col">
              <div className="card border border-muted m-1 p-1 text-center">
                <span key={email.id}>
                  {email.email}
                  {email.id !== user?.id && (
                    <button
                      className="btn btn-sm btn-warning ms-2"
                      onClick={async () => {
                        try {
                          await revokeMutation({
                            entryId,
                            grantingUserId: user?.id ?? "",
                            revokedId: email.id,
                            permsType: permType,
                          })
                          await refetch()
                          toast.success(`Permissions removed for ${email.email}`)
                        } catch (error) {
                          toast.error(error)
                        }
                      }}
                    >
                      Revoke
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  )
}
