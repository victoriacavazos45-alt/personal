// Minimal hash router — keeps back-button behavior on mobile without a
// routing dependency. State rides in memory alongside the hash.

import { createContext, useContext, useEffect, useState } from 'react'

const RouterContext = createContext(null)

let pendingState = null

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(() => ({
    path: window.location.hash.replace(/^#/, '') || '/home',
    state: null,
  }))

  useEffect(() => {
    const onHash = () => {
      setRoute({ path: window.location.hash.replace(/^#/, '') || '/home', state: pendingState })
      pendingState = null
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (path, state = null) => {
    pendingState = state
    if (window.location.hash === `#${path}`) {
      setRoute({ path, state })
      pendingState = null
    } else {
      window.location.hash = path
    }
  }

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>
}

export function useRouter() {
  return useContext(RouterContext)
}
