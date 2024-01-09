import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'https://home.cballot.fr/auth',
  realm: 'D2.Companion',
  clientId: 'corentin-ballot.github.io'
})

export default keycloak
