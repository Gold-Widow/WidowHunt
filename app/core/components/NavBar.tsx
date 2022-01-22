import { useRouter, useSession } from "@blitzjs/core"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import React, { Suspense } from "react"
import { currentUserType } from "app/core/hooks/useCurrentUser"
import { Link, useMutation } from "blitz"
import logout from "app/auth/mutations/logout"

const NavBar = () => {
  const router = useRouter()

  const UserNameDisplay = () => {
    const currentUser = useCurrentUser()

    return (
      <ul className="navbar-nav list-inline">
        {currentUser?.name &&
          <li className="nav-link my-auto">
            Welcome, {currentUser?.name}  
          </li>
        }
        <LoginLogoutCard currentUser={currentUser} />
      </ul>
    )
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="https://hunt.goldwidow.io">
          <img src="/logo.png" alt="" loading="lazy" style={{ marginTop: "-3px" }} height={42} />
        </a>
        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#Main-Navbar"
          aria-controls="Main-Navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Collapsible wrapper */}
        <div className="collapse navbar-collapse" id="Main-Navbar">
          {/* Left links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item active">
              <Link href="/">
              <a className="nav-link">
                Home
              </a>
              </Link>
            </li>            
          </ul>
          <Suspense fallback="Loading...">
            <UserNameDisplay />
          </Suspense>
        </div>
      </div>
    </nav>
  )
}

const LoginLogoutCard:React.FC<{currentUser:currentUserType}> = ({currentUser}) => {
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <a className="nav-link">
        <button
          className="btn btn-sm btn-warning text-dark my-1"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
      </a>
    )
  } else {
    return (
      <>
        <div className="nav-link">
          <Link href="/signup">
            <a className="btn btn-warning btn-sm text-dark">
              <strong>Sign Up</strong>
            </a>
          </Link>     
        </div>   
        <div className="nav-link">
          <Link href="/login">
            <a className="btn btn-warning btn-sm text-dark">
              <strong>Login</strong>
            </a>
          </Link>
        </div>
      </>
    )
  }
}

export default NavBar