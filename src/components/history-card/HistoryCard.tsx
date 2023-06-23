import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import { Box } from '@material-ui/core';

interface HistoryCardProps {
  imgSrc: string;
  startTime: number;
  figthers: string[];
}

export default function HistoryCard(props: HistoryCardProps) {
  const theme = useTheme();
  const date = new Date(props.startTime);
  const formatedDateTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date);

  return (
    <Card sx={{ display: 'flex', overflow: "hidden", height: "100%", width: "100%" }}>
      <CardMedia
        component="img"
        sx={{ width: 80, flexShrink: 0 }}
        image={props.imgSrc}
        alt=""
      />
      <Badge color="secondary" badgeContent={formatedDateTime} sx={{ transform: "none", borderRadius: theme.spacing(.5), overflow: "hidden", flexShrink: 1, flexGrow: 1 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          <Typography variant="subtitle1" noWrap>
            {props.figthers[0]}
          </Typography>
          {props.figthers.length > 1 && <Typography variant="subtitle2" color="text.secondary" noWrap>
            {props.figthers.slice(1).join(", ")}
          </Typography>}
        </CardContent>
      </Badge>
    </Card>
  );
}