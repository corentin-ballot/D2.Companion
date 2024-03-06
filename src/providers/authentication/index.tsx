import React from 'react'
import { AuthProvider, useAuth as useOidcAuth } from 'react-oidc-context'

export const useAuth = (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') ? useOidcAuth : () => ({
    isAuthenticated: true,
    isLoading: false,
    user: {
        access_token: `aaa.${btoa(JSON.stringify({realm_access: { roles: ['default-roles-d2.companion'] }}))}.aaa`
    },
    signinRedirect: () => null
});

interface AuthenticationProviderProps {
    children: React.ReactElement,
}

export const AuthenticationProvider = ({children}: AuthenticationProviderProps): React.ReactElement => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') 
    return <AuthProvider
    authority='https://home.cballot.fr/auth/realms/D2.Companion'
    client_id='corentin-ballot.github.io'
    redirect_uri={!process.env.NODE_ENV || process.env.NODE_ENV === 'production' ? "https://corentin-ballot.github.io/D2.Companion" : window.location.origin}
    onSigninCallback={(user) => {
      window.history.replaceState({}, document.title, window.location.pathname)
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      user.decoded_token = JSON.parse(atob((user?.access_token ?? "").split('.')[1])).realm_access.roles
    }}>
        {children}
    </AuthProvider>

    return children;
}

