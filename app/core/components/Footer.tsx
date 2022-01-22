export const Footer = () => (
    <footer className="bg-light text-lg-left">
      <div className="container-fluid text-light" style={{ backgroundColor: "#000" }}>
        <div className="row">
          <div className="col-auto me-auto">
            <div className="text-center p-3">
              {process.env.NEXT_PUBLIC_APP_DISPLAY_NAME} <em className="text-muted">- Built using&nbsp;
              <a href="https://blitzjs.com/" target="_blank" rel="noopener noreferrer">Blitz</a></em>
            </div>
          </div>
          <div className="col-auto ml-auto">
            {/*<!-- Copyright -->*/}
            <div className="text-center p-3">
              © {new Date().getFullYear()} Copyright:&nbsp;
              <a className="" href="https://goldwidow.io/">
                Gold Widow LLC
              </a>
            </div>
          </div>
        </div>
      </div>
      {/*<!-- Copyright -->*/}
    </footer>
  )
  