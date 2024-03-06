import React, { useState, createContext, useContext, useEffect } from 'react'
import {
  Box,
  Typography,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '../authentication'

const initialState = {
  roles: [],
  hasRole: (r: string): boolean => typeof r === "string" && false,
}

const AuthorizationContext = createContext(initialState)
export const useAuthorization = () => useContext(AuthorizationContext)

interface AuthorizationPrividerProps {
  children: React.ReactElement,
}

export const AuthorizationProvider = ({ children }: AuthorizationPrividerProps): React.ReactElement => {
  const [state, setState] = useState(initialState)
  const auth = useAuth()

  useEffect(() => {
    if (auth.isAuthenticated) {
      const parsedAccessToken = JSON.parse(atob(auth?.user?.access_token?.split('.')[1] ?? '{"realm_access": { "roles": [] }}'))

      setState({
        ...state,
        roles: parsedAccessToken.realm_access.roles,
        hasRole: (role: string) => (parsedAccessToken.realm_access.roles as string[]).includes(role)
      })
    }
  }, [auth.isAuthenticated])

  if (!auth.isLoading && !auth.isAuthenticated) {
    auth.signinRedirect()
  }

  if (!auth.isAuthenticated) return (
    <Backdrop open>
      <Box sx={{ color: '#fff', textAlign: 'center' }}>
        <Typography>Authenticating</Typography>
        <CircularProgress size={16} color="inherit" />
      </Box>
    </Backdrop>
  )

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  )
}
