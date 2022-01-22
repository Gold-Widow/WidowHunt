import { AuthenticationError, Link, useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    <div className="mask h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div className="row h-75 align-items-center">
        <div className="col-sm-12 col-md-4 col-lg-3 mx-md-auto">
          <div className="card p-2 mt-3">
            <h1>Login</h1>

            <Form
              schema={Login}
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values) => {
                try {
                  await loginMutation(values)
                  props.onSuccess?.()
                } catch (error) {
                  if (error instanceof AuthenticationError) {
                    return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
                  } else {
                    return {
                      [FORM_ERROR]:
                        "Sorry, we had an unexpected error. Please try again. - " +
                        error.toString(),
                    }
                  }
                }
              }}
            >
              <LabeledTextField name="email" label="Email" />
              <LabeledTextField name="password" label="Password" type="password" />
              <input type="submit" className="btn btn-block btn-warning text-dark" value="Login" />
              <div>
                <Link href="/forgot-password">
                  <a>Forgot your password?</a>
                </Link>
              </div>
            </Form>

            <div style={{ marginTop: "1rem" }}>
              Or <Link href="/signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
