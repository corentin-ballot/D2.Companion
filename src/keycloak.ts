import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'https://auth.home.cballot.fr',
  realm: 'D2.Companion',
  clientId: 'corentin-ballot.github.io'
})

export default keycloak
