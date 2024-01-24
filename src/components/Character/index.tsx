import React from 'react';
import { Typography, Box, Avatar } from '@mui/material';
import { useCharacter } from '../../providers/sockets/CharacterContext';

const Character = () => {
    const character = useCharacter()

    return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar alt={character.infos.name} src={`${process.env.PUBLIC_URL}/img/classes/mini_${character.infos.breed}_${character.infos.sex ? '1' : '0'}.png`} />
        <Box>
            <Typography variant="subtitle1">{character.infos.name}</Typography>
            <Typography variant="body2">Niv. {character.infos.level}</Typography>
        </Box>
    </Box>
}
export default Character;