// /* eslint-disable no-unsafe-optional-chaining */
// /* eslint-disable no-nested-ternary */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useEffect } from 'react';
import {
    GridLegacy,
    Link,
    Typography,
    Paper,
    useTheme,
    Stack,
    Box
} from '@mui/material';

import RecievedDommagesPerRound from '../../components/RecievedDommagesPerRound';
import TotalDommages from '../../components/TotalDommages';
import RecievedTypeRepartition from '../../components/RecievedTypeRepartition';
import DealedTypeRepartition from '../../components/DealedTypeRepartition';
import DealedDommagesPerRound from '../../components/DealedDommagesPerRound';
import EmptyState from '../../components/EmptyState';
import HistoryCard from '../../components/HistoryCard';
import { initialFight, useFight } from '../../providers/sockets/FightContext';
import FighterAvatar from '../../components/FighterAvatar';
import FightAction from '../../components/FightAction';
import FightMap from '../../components/FightMap';

const Fight = () => {
    const theme = useTheme();
    const { currentFight, history } = useFight();

    const [displayedFight, setDisplayedFight] = useState(initialFight);
    const [fightersFilter, setFightersFilter] = useState([] as string[]);


    // Avoid history check when fighting
    useEffect(() => {
        setDisplayedFight(currentFight);
    }, [currentFight]);

    return <Box sx={{ flexGrow: 1 }}>
        <GridLegacy container spacing={2}>
            {/* Not fighting */}
            {displayedFight.round === -1 &&
                <GridLegacy item xs={12}>
                    <EmptyState>
                        No active fight, start fighting{history && history.length ? " or select a fight in the history" : ""} to see statistics.
                    </EmptyState>
                </GridLegacy>
            }

            {/* Fight preparation */}
            {displayedFight.round === 0 &&
                <GridLegacy item xs={12}>
                    <EmptyState>
                        Preparation phase, get ready!
                    </EmptyState>
                </GridLegacy>
            }

            {/* Fight view */}
            {displayedFight.round > 0 &&
                <>
                    {/* Main Graph (dealed dommages with types) */}
                    <GridLegacy item xs={12}>
                        <Paper sx={{ padding: 2 }}>
                            <GridLegacy container justifyContent="space-between" alignItems="center">
                                <Typography variant="h2">Dommages dealed</Typography>
                                {/* Dofensive */}
                                <Link target="_blank" rel="noreferrer" href={`https://dofensive.com/fr/monster/${displayedFight.fighters.map(fighter => fighter.actorInformation.fighter.aiFighter?.monsterFighterInformation.monsterGid).filter(v => typeof v !== "undefined").join(",")}`}>Voir les monstres sur Dofensive</Link>
                            </GridLegacy>
                            <TotalDommages fight={displayedFight} />
                        </Paper>
                    </GridLegacy>

                    {/* Fighters display filter */}
                    <GridLegacy item xs={12}>
                        <Stack direction="row" justifyContent="center" spacing={4} flexWrap="wrap">
                            {displayedFight.turnList.map(f => {
                                const fighter = displayedFight.fighters.find(fi => fi.actorId === f.id);
                                return <FighterAvatar fighter={fighter} isHighlighted={fightersFilter.includes(fighter?.actorId || "")} key={fighter?.actorId} onClick={() => setFightersFilter(fightersFilter.includes(f.id) ? fightersFilter.filter(fi => fi !== f.id) : [f.id])} />
                            })}
                        </Stack>
                    </GridLegacy>

                    {/* Graph (dealed dommages per round) */}
                    {fightersFilter.length > 0 &&
                        <GridLegacy item xs={12} md={6}>
                            <Paper sx={{ padding: 2 }}>
                                <Typography variant="h2">Dommages dealed per round</Typography>
                                <DealedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                            </Paper>
                        </GridLegacy>}

                    {/* Graph (recieved dommages per round) */}
                    {fightersFilter.length > 0 &&
                        <GridLegacy item xs={12} md={6}>
                            <Paper sx={{ padding: 2 }}>
                                <Typography variant="h2">Dommages recieved per round</Typography>
                                <RecievedDommagesPerRound fight={displayedFight} fightersFilter={fightersFilter} />
                            </Paper>
                        </GridLegacy>}

                    {/* Type repartition deal */}
                    {fightersFilter.length > 0 &&
                        <GridLegacy item xs={12} md={6}>
                            <Paper sx={{ padding: 2 }}>
                                <Typography variant="h2">Type repartition dealed</Typography>
                                <DealedTypeRepartition fight={displayedFight} fightersFilter={fightersFilter} />
                            </Paper>
                        </GridLegacy>}

                    {/* Type repartition recieves */}
                    {fightersFilter.length > 0 &&
                        <GridLegacy item xs={12} md={6}>
                            <Paper sx={{ padding: 2 }}>
                                <Typography variant="h2">Type repartition recieves</Typography>
                                <RecievedTypeRepartition fight={displayedFight} fightersFilter={fightersFilter} />
                            </Paper>
                        </GridLegacy>}

                    {/* Map */}
                    <GridLegacy item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h2">Map</Typography>
                            <FightMap fight={displayedFight} height={300}/>
                        </Paper>
                    </GridLegacy>

                    {/* Logs */}
                    <GridLegacy item xs={12} md={6}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h2">Logs</Typography>
                            <Box style={{ maxHeight: 300, overflow: 'auto' }}>
                                {displayedFight.actions.map((action: any, index: number) =>
                                    // eslint-disable-next-line react/no-array-index-key
                                    <FightAction action={action} fighters={displayedFight.fighters} key={index} />
                                )}
                            </Box>
                        </Paper>
                    </GridLegacy>
                </>
            }

            {/* History */}
            {history && history.length > 0 &&
                <GridLegacy item xs={12}>
                    <Box>
                        <Typography variant="h2">History</Typography>

                        <GridLegacy container spacing={2} sx={{ alignItems: "stretch", flexWrap: "nowrap", overflow: "auto", whiteSpace: "nowrap", width: "100%", paddingBottom: theme.spacing(.25) }}>
                            {history.map(fight =>
                                <GridLegacy item xs={2} onClick={() => setDisplayedFight(fight)} sx={{ flexShrink: 0 }} key={`${fight.startTime}-${fight.endTime}`}>
                                    <HistoryCard
                                        key={fight.startTime}
                                        fight={fight}
                                    />
                                </GridLegacy>
                            )}
                        </GridLegacy>
                    </Box>
                </GridLegacy>
            }
        </GridLegacy>
    </Box>
}

export default Fight;