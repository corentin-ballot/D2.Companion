import React from 'react';
import { Stack, Card, CardContent, CardMedia, Typography, Badge } from '@mui/material';
import { Fight } from '../../providers/sockets/FightContext';
import useDofusMonster from '../../hooks/dofus-data/useDofusMonster';
import FighterName from '../FighterName';

interface HistoryCardProps {
  fight: Fight;
}

const HistoryCard = ({ fight }: HistoryCardProps) => {
  const date = new Date(fight.startTime);
  const formatedDateTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date);

  const fighters = fight.fighters.filter(f => f.actorInformation.fighter.spawnInformation.team === "TEAM_DEFENDER" && !f.actorInformation.fighter.stats.summoned);
  if(!fighters[0]?.actorInformation.fighter.aiFighter?.monsterFighterInformation.monsterGid) return null;
  
  const monsterRequest = useDofusMonster(fighters[0].actorInformation.fighter.aiFighter?.monsterFighterInformation.monsterGid)
  if(!monsterRequest.data) return null;

  return (
    <Card sx={{ display: 'flex', overflow: "hidden", height: "100%", width: "100%", cursor: "pointer" }}>
      <CardMedia
        component="img"
        sx={{ width: 80, flexShrink: 0 }}
        image={`http://localhost:3960/images/monsters/${monsterRequest.data.id}`}
        alt=""
      />
      <Badge color="secondary" badgeContent={formatedDateTime} sx={{ overflow: "hidden", flexGrow: 1, flexShrink: 1, ".MuiBadge-badge": { transform: "none", borderRadius: 1 }}}>
        <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          <Typography variant="subtitle1" noWrap>
            <FighterName fighter={fighters[0]} />
          </Typography>
          {fighters.length > 1 && <Typography variant="subtitle2" color="text.secondary" noWrap>
            <Stack direction="row" divider={<span>,&nbsp;</span>}>{fighters.slice(1).map(f => <FighterName fighter={f} />)}</Stack>
          </Typography>}
        </CardContent>
      </Badge>
    </Card>
  );
}

export default HistoryCard;