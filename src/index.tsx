import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ThemeProvider } from '@mui/material'
import theme from './mui.theme'
import { AuthProvider } from 'react-oidc-context'
import { BrowserRouter } from 'react-router-dom'
import authConfig from './auth.config'
import { SocketProvider } from './providers/sockets'

const root = ReactDOM.createRoot(
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <AuthProvider { ...authConfig }>
      <ThemeProvider theme={ theme }>
        <SocketProvider>
          <BrowserRouter basename={ process.env.PUBLIC_URL }>
            <App />
          </BrowserRouter>
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
