import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'react-oidc-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import './index.css'
import App from './App'
// import reportWebVitals from './reportWebVitals'
import theme from './mui.theme'
import SocketProvider from './providers/sockets'
import { AuthorizationProvider } from './providers/authorization'

const root = ReactDOM.createRoot(
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  document.getElementById('root') as HTMLElement
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity },
  },
})

persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({
    storage: window.localStorage,
  }),
  maxAge: Infinity,
})

root.render(
  <React.StrictMode>
    <AuthProvider
      authority='https://home.cballot.fr/auth/realms/D2.Companion'
      client_id='corentin-ballot.github.io'
      redirect_uri={!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? window.location.origin : "https://corentin-ballot.github.io/D2.Companion"}
      onSigninCallback={(user) => {
        window.history.replaceState({}, document.title, window.location.pathname)
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        user.decoded_token = JSON.parse(atob((user?.access_token ?? "").split('.')[1])).realm_access.roles
      }}>
      <AuthorizationProvider>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <SocketProvider>
              <BrowserRouter basename={process.env.PUBLIC_URL}>
                <App />
              </BrowserRouter>
            </SocketProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </AuthorizationProvider>
    </AuthProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
