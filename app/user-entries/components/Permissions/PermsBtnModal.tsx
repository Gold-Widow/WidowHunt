import { useId } from "@reach/auto-id"
import Fallback from "app/core/components/Fallback"
import { userEntry } from "db"
import { FC, Suspense } from "react"
import { PermissionsCard } from "./PermissionsCard"

export const PermsBtnModal: FC<{ entryId: userEntry["id"]; openText?: string }> = ({
  entryId,
  openText,
}) => {
  const modalId = "Perms-Modal-" + useId()
  const modalLabelId = "Perms-Modal-Label" + useId()

  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-sm mx-1"
        data-mdb-toggle="modal"
        data-mdb-target={`#${modalId}`}
      >
        {openText ?? "Permissions"}
      </button>

      <div
        className="modal fade"
        id={modalId}
        tabIndex={-1}
        aria-labelledby={modalLabelId}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={modalLabelId}>
                Permissions
              </h5>
              <button
                type="button"
                className="btn-close"
                data-mdb-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Suspense fallback={<Fallback />}>
                <PermissionsCard entryId={entryId} />
              </Suspense>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-mdb-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
