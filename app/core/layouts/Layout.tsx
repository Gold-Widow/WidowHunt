import { ReactNode, Suspense, useEffect, useRef, useState } from "react"
import { Head } from "blitz"
import NavBar from "app/core/components/NavBar"
import { Footer } from "app/core/components/Footer"
import { Toaster } from "react-hot-toast"
import FOG from "vanta/dist/vanta.fog.min"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  const [vantaEffect, setVantaEffect] = useState(0)
  const myRef = useRef(null)

  // z-index issue; https://www.py4u.net/discuss/309204
  // THe bootstrap modal creates a backdrop tacked near the end of the body tag with z-index 1040
  // THe botstrap modal itself has z-index 1050.
  // Vanta.js, when added to an element, will make that element have z-index 0, and the elemtn proceeding it
  // z-index 1
  // Nested z-index elements have a different priority order, causing the modal to be hidden under its backdrop
  // to fix this, an element with fixed position, a z-index of -2, and 100% width and height was created
  // There is a thing called "PORTAL" that's used for stuff like this. Look into that.
  // Or switch to mantine
  useEffect(() => {
    const effect = FOG({
      el: myRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      highlightColor: 0xff9900, //0xff9900
      midtoneColor: 0xff9900,
      lowlightColor: 0xaa55aa,
      baseColor: 0xffffff, //a45544
      speed: 2.5,
    })
    setVantaEffect(effect)
    // const interval = setInterval(() => effect.resize(), 3000)

    // return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>{title || "Widow-Hunt"}</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <!-- Font Awesome --> */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          rel="stylesheet"
        />
        {/* <!-- Google Fonts --> */}
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
        {/* <!-- MDB --> */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.2.0/mdb.min.css"
          rel="stylesheet"
        />
        <link href="/site.css" rel="stylesheet" />
      </Head>
      <NavBar />
      <div
        ref={myRef}
        className="grad-rep"
        style={{ zIndex: -2, position: "fixed", width: "100%", height: "100%" }}
      ></div>
      <div
        id="Main-Display-Container"
        className="container-fluid"
        style={{ minHeight: "100vh", paddingTop: "70px" }}
      >
        <Toaster />
        <Suspense fallback={<FallbackBody />}>{children}</Suspense>
      </div>
      <Footer />

      {/* <!-- MDB --> */}

      <script
        type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.2.0/mdb.min.js"
      ></script>
      <script src="/Vanta/three.min.js"></script>
    </>
  )
}

const FallbackBody = () => (
  <div className="container-fluid">
    <div className="row align-items-center" style={{ minHeight: "75vh" }}>
      <div className="col-auto mx-auto">
        <div className="card p-2 m-1 text-center">
          <h1>
            Loading{" "}
            <span role="img" aria-label="Loading emoji">
              ⌛
            </span>
          </h1>
        </div>
      </div>
    </div>
  </div>
)
export default Layout
