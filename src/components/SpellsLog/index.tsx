/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { Box } from '@mui/material';
import { Fight } from '../../providers/sockets/FightContext';

interface DealedDommagesPerRoundProps {
    fight: Fight;
    fightersFilter?: number[]
}

const SpellsLog = ({ fight }: DealedDommagesPerRoundProps) => <Box>
        {fight.spells.map(spell => {
            const source = fight.fighters.find(f => f.contextualId === spell.sourceId)?.name;
            const target = fight.fighters.find(f => f.contextualId === spell.targetId)?.name;
        
        return <Box>
            <span>{source}</span> lance <span>{spell.name}</span><span>{spell.critical > 1 ? " (Critique)" : ""}</span>
            { spell.targetId !== 0 && source !== target && " sur "}
            { spell.targetId !== 0 && source !== target && <span>{target}</span>}.
        </Box>})}
    </Box>

export default SpellsLog;