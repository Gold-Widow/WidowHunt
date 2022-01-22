import { Link, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { EntriesTable } from "app/user-entries/components/EntriesTable"
import Fallback from "app/core/components/Fallback"
import { Suspense } from "react"

const Home: BlitzPage = () => {
  return (
    <main>
      <div className="row">
        <div className="col-sm-12 col-md-8 col-lg-6 mx-auto">
          <div className="card border border-dark p-2 m-1">
            <div className="display-3">
              <span role="img" aria-label="Spider emoji">
                🕷️
              </span>
              &nbsp;
              {process.env.NEXT_PUBLIC_APP_DISPLAY_NAME}
            </div>
            <p>
              A Text based progress tracker. Harness the simplicity of yaml and the power of regex
              to track issues or document a complex process.
            </p>
            <em className="text-muted">
              Please note: This project is still in alpha. The database, including signups and yaml
              entries may be wiped periodically
            </em>
          </div>
        </div>
        <div className="w-100"></div>
        <div className="col-sm-12 col-md-8 col-lg-6 mx-auto">
          <div className="card border border-dark p-2 m-1">
            <h2>Get started</h2>
            <Link href="/user-entries">
              <a className="btn btn-link">Create a new entry</a>
            </Link>
          </div>
        </div>
        <div className="w-100"></div>
        <div className="col-sm-12 col-md-8 col-lg-6 mx-auto mt-5">
          <div className="card border border-dark p-2 m-1">
            <h3>Your saved entries</h3>
            <Suspense fallback={<Fallback />}>
              <EntriesTable />
            </Suspense>
          </div>
        </div>
        <div className="w-100"></div>
        <div className="col-sm-12 col-md-8 col-lg-6 mx-auto mt-5">
          <div className="card border border-dark p-2 m-1">
            <h3>Feature roadmap</h3>
            <hr />
            <strong>Custom Configuration</strong>
            <p className="ms-3">
              <em>Allows users to add and edit a custom yaml based config file.</em>
              <br />
              <br />
              This will allow matching on regex expressions, and perform behaviors on all matched
              expressions.
              <br />
              For example, users could define a regex '/nt\(\d\)/g', and and define behavior that
              updates the number within the parantheses every second to create a stopwatch timer.
            </p>
            <strong>Sharing</strong>
            <p className="ms-3">
              <em>Allows users to share their entries with users</em>
              <br />
              <br />
              This will allow users with accounts to have shared read or write access, and allow the
              generation of view only links for non-logged in users
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
