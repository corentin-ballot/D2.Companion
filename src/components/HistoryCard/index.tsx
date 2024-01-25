import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';

interface HistoryCardProps {
  imgSrc: string;
  startTime: number;
  figthers: string[];
}

const HistoryCard = ({ imgSrc, startTime, figthers }: HistoryCardProps) => {
  const date = new Date(startTime);
  const formatedDateTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date);

  return (
    <Card sx={{ display: 'flex', overflow: "hidden", height: "100%", width: "100%", cursor: "pointer" }}>
      <CardMedia
        component="img"
        sx={{ width: 80, flexShrink: 0 }}
        image={imgSrc}
        alt=""
      />
      <Badge color="secondary" badgeContent={formatedDateTime} sx={{ overflow: "hidden", flexShrink: 1, ".MuiBadge-badge": { transform: "none", borderRadius: 1 }}}>
        <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          <Typography variant="subtitle1" noWrap>
            {figthers[0]}
          </Typography>
          {figthers.length > 1 && <Typography variant="subtitle2" color="text.secondary" noWrap>
            {figthers.slice(1).join(", ")}
          </Typography>}
        </CardContent>
      </Badge>
    </Card>
  );
}

export default HistoryCard;