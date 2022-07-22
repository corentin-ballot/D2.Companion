import React from 'react';

function About() {
    return <div>
        <p>Dofus compagnon app made by <a href="https://github.com/corentin-ballot">Corentin Ballot</a>.</p>

        <h3>How it work ?</h3>

        <p>This app use <a href="https://frida.re/">Frida</a> which is a dynamic instrumentation toolkit 
            for developers, reverse-engineers, and security researchers to intercept network communications between 
            Dofus client and serveur.</p>

        <p>Intercepted pakets are transmits as receive from client/server to server/client without any modifications
            and no additionnal data is send to either client or server.</p>

        <p>Once received, data are decrypted and shared in a websocket server. This UI connect to this websocket 
            and display informations based on that data.</p>
        
        <h3>Is that a bot ?</h3>

        <p>No it's not as this projet doesn't directly interact with either client nor server. It simply read network 
            communications.</p>
    </div>
}

export default About;