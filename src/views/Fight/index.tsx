/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { Grid, Link, Typography, Paper, Avatar, Tooltip, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';

import RecievedDommagesPerRound from '../../components/RecievedDommagesPerRound';
import TotalDommages from '../../components/TotalDommages';
import SpellsLog from '../../components/SpellsLog';
import RecievedTypeRepartition from '../../components/RecievedTypeRepartition';
import DealedTypeRepartition from '../../components/DealedTypeRepartition';
import DealedDommagesPerRound from '../../components/DealedDommagesPerRound';
import EmptyState from '../../components/EmptyState';
import HistoryCard from '../../components/HistoryCard';
import { initialFight, useFight } from '../../providers/sockets/FightContext';

const Fight = () => {
    const theme = useTheme();
    const { currentFight, history } = useFight();

    const [displayedFight, setDisplayedFight] = useState(initialFight);
    const [fightersFilter, setFightersFilter] = useState([] as number[]);


    // Avoid history check when fighting
    useEffect(() => {
        setDisplayedFight(currentFight);
    }, [currentFight]);

    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            {/* Not fighting */}
            {displayedFight.round === -1 &&
                <Grid item xs={12}>
                    <EmptyState>
                        No active fight, start fighting{history && history.length ? " or select a fight in the history" : ""} to see statistics.
                    </EmptyState>
                </Grid>
            }

            {/* Fight preparation */}
            {displayedFight.round === 0 &&
                <Grid item xs={12}>
                    <EmptyState>
                        Preparation phase, get ready!
                    </EmptyState>
                </Grid>
            }

            {/* Fight view */}
            {displayedFight.round > 0 &&
                <>
                    {/* Main Graph (dealed dommages with types) */}
                    <Grid item xs={12}>
                        <Paper sx={{ padding: 2 }}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Typography variant="h2">Dommages dealed</Typography>
                                {/* Dofensive */}
                                <Link target="_blank" rel="noreferrer" href={`https://dofensive.com/fr/monster/${displayedFight.fighters.map(fighter => fighter.creatureGenericId).join(",")}`}>Voir les monstres sur Dofensive</Link>
                            </Grid>
                            <TotalDommages fight={displayedFight} />
                        </Paper>
                    </Grid>

                    {/* Fighters display filter */}
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="center" spacing={4} flexWrap="wrap">
                            {displayedFight.turnList.map(fighterId => {
                                const fighter = displayedFight.fighters.find(f => f.contextualId === fighterId);
                                return (
                                    <Tooltip title={fighter?.name}>
                                        <Avatar
                                            alt={fighter?.name}
                                            sx={{
                                                width: 96, height: 96,
                                                cursor: "pointer",
                                                bgcolor: fightersFilter.includes(fighterId) ? theme.palette.primary.main : theme.palette.grey[100],
                                                ":hover": {
                                                    bgcolor: fightersFilter.includes(fighterId) ? theme.palette.primary.main : theme.palette.grey[300],
                                                    "img": {
                                                        transform: "scale(1.6)",
                                                    }
                                                }
                                            }}
                                            onClick={() => setFightersFilter(fightersFilter.includes(fighterId) ? fightersFilter.filter(f => f !== fighterId) : [fighterId])}
                                            data-img={(fighter?.masterId ? fighter?.img : fighter?.creatureGenericId ? `http://localhost:3980/img/monsters/${fighter?.creatureGenericId}` : `${process.env.PUBLIC_URL}/img/classes/${fighter?.breed}-${fighter?.sex ? 'female' : 'male'}.png`)} 
                                            src={(fighter?.masterId ? fighter?.img : fighter?.creatureGenericId ? `http://localhost:3980/img/monsters/${fighter?.creatureGenericId}` : `${process.env.PUBLIC_URL}/img/classes/${fighter?.breed}-${fighter?.sex ? 'female' : 'male'}.png`)} />
                                    </Tooltip>
                                )
                            })}
                        </Stack>
                    </Grid>

                    {/* Graph (dealed dommages per round) */}
                    {fightersFilter.length > 0 && 
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h2">Dommages dealed per round</Typography>
                            <DealedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                        </Paper>
                    </Grid>}

                    {/* Graph (recieved dommages per round) */}
                    {fightersFilter.length > 0 && 
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h2">Dommages recieved per round</Typography>
                            <RecievedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                        </Paper>
                    </Grid>}

                    {/* Type repartition deal */}
                    {fightersFilter.length > 0 && 
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h2">Type repartition dealed</Typography>
                            <DealedTypeRepartition fight={displayedFight} fightersFilter={fightersFilter} />
                        </Paper>
                    </Grid>}

                    {/* Type repartition recieves */}
                    {fightersFilter.length > 0 && 
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h2">Type repartition recieves</Typography>
                            <RecievedTypeRepartition fight={displayedFight} fightersFilter={fightersFilter} />
                        </Paper>
                    </Grid>}

                    {/* Spells */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h2">Spells</Typography>
                            <SpellsLog fight={displayedFight} fightersFilter={fightersFilter} />
                        </Paper>
                    </Grid>
                </>
            }

            {/* History */}
            {history && history.length > 0 &&
                <Grid item xs={12}>
                    <Box>
                        <Typography variant="h2">History</Typography>
                        {/* <div>
                        {currentFight.round > 0 && <button className={styles.fightsHisotry__item} onClick={() => setDisplayedFight(currentFight)}>Current fight</button>}
                        <button onClick={async () => {
                            const fileName = "file";
                            const json = JSON.stringify(history);
                            const blob = new Blob([json], { type: 'application/json' });
                            const href = await URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = href;
                            link.target = "_blank"
                            link.download = fileName + ".json";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}>Save</button>
                    </div> */}

                        <Grid container spacing={2} sx={{ alignItems: "stretch", flexWrap: "nowrap", overflow: "auto", whiteSpace: "nowrap", width: "100%", paddingBottom: theme.spacing(.25) }}>
                            {history.map(fight =>
                                <Grid item xs={2} onClick={() => setDisplayedFight(fight)} sx={{ flexShrink: 0 }}>
                                    <HistoryCard
                                        key={fight.startTime}
                                        startTime={fight.startTime}
                                        figthers={fight.fighters.filter(f => f.contextualId < 0 && !f.stats.summoned && f.spawnInfo.teamId > 0).map(f => f.name)}
                                        imgSrc={`http://localhost:3980/img/monsters/${  fight.fighters.find(f => f.contextualId < 0 && !f.stats.summoned && f.spawnInfo.teamId > 0)?.creatureGenericId}`}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Grid>
            }
        </Grid>
    </Box>
}

export default Fight;