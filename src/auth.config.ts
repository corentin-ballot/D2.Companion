const authConfig = {
    authority: 'https://home.cballot.fr/auth/realms/D2.Companion',
    client_id: 'corentin-ballot.github.io',
    redirect_uri: window.location.origin,
    onSigninCallback: (): void => {
        window.history.replaceState({}, document.title, window.location.pathname);
    },
};

export default authConfig;