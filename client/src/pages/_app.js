import React from 'react'
import { storeLayout } from '../comps/layout/store-layout/store-layout'
import '../styles/index.sass'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import 'react-toastify/dist/ReactToastify.css'

const MyApp = ({ Component, pageProps, router }) => {
  const nodeRef = React.useRef(null)
  const getLayout = Component.getLayout ?? storeLayout
  return (
    // <React.StrictMode>
    <>
      {getLayout(
        <SwitchTransition mode="out-in">
          <CSSTransition
            nodeRef={nodeRef}
            key={router.pathname}
            classNames="page"
            timeout={300}
          >
            <div ref={nodeRef}>
              <Component {...pageProps} />
            </div>
          </CSSTransition>
        </SwitchTransition>,
      )}
    </>
    // </React.StrictMode>
  )
}

export default MyApp
