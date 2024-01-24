import React from 'react';

import { Box, Typography, Divider } from '@mui/material';

const About = () => <Box>
    <Typography variant="h1">How it works ?</Typography>
    <Typography sx={{ marginBottom: "16px" }}>A sniffer is required to use this interface. This sniffer will scan network messages send by Dofus server and decrypt them.</Typography>
    <Typography sx={{ marginBottom: "16px" }}>Once decrypted, this app will be able to get that data and display it in a enhaced interface.</Typography>

    <Typography variant="h1">Is that a bot ?</Typography>
    <Typography sx={{ marginBottom: "16px" }}>No it&apos;s not as this projet doesn&apos;t directly interact with either client nor server. It simply read network
        communications and does not automatise any action.</Typography>

    <Divider sx={{ marginTop: "32px", marginBottom: "32px" }} />

    <Typography sx={{ textAlign: "end" }}>Dofus compagnon app made by <a href="https://github.com/corentin-ballot">Corentin Ballot</a>.</Typography>
</Box>


export default About;