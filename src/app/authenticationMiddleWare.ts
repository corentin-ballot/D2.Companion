import { AnyAction, Middleware } from '@reduxjs/toolkit';
import Keycloak from 'keycloak-js';

const authenticationMiddleWare: Middleware = (store) => {

    const keycloak = new Keycloak({
        url: 'https://home.cballot.fr/auth',
        realm: 'D2.Companion',
        clientId: 'corentin-ballot.github.io'
    });
    
    try {
        keycloak.init({onLoad: 'login-required',}).then((authenticated) => {
            console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`, keycloak);
        });
    } catch (error) {
        console.error('Failed to initialize adapter:', error);
    }

    return (next) => (action: AnyAction) => {
        return next(action);
    };
}

export default authenticationMiddleWare;