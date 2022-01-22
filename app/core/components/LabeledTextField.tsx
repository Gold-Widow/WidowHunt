import { ChangeEventHandler, forwardRef, PropsWithoutRef } from "react"
import { useField } from "react-final-form"
import { useId } from "@reach/auto-id"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  id?: string
  value?: string | number
  onChange?: ChangeEventHandler<HTMLInputElement>
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, id, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse: props.type === "number" ? Number : undefined,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
    const elementId = useId(id)
    return (
      <div {...outerProps}>
        <div className="form-outline">
          <input
            type="text"
            id={elementId}
            {...input}
            disabled={submitting}
            {...props}
            ref={ref}
            className="form-control"
          />
          {!props.hidden &&
          <>
            <label className="form-label" htmlFor={elementId} style={{ marginLeft: "0px" }}>
              {label}
            </label>
            <div className="form-notch">
              <div className="form-notch-leading" style={{ width: "9px" }}></div>
              <div className="form-notch-middle" style={{ width: "75.2px" }}></div>
              <div className="form-notch-trailing"></div>
            </div>
          </>
          }
        </div>

        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </div>
    )
  }
)

export default LabeledTextField
