import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControlLabel, Checkbox, Link, Grid, Typography, Avatar, Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAppSelector } from '../../app/hooks';
import {
    selectActiveQuests,
    selectFinishedQuests,
    selectReinitDoneQuests
} from '../character/characterSlice';

export interface Name {
    de: string;
    en: string;
    es: string;
    fr: string;
    it: string;
    nl: string;
    pt: string;
    ru: string;
    id: number;
}

export interface QuestCategorie {
    _id: string;
    questIds: number[];
    id: number;
    nameId: number;
    name: Name;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface Quest {
    _id: string;
    stepIds: number[];
    id: number;
    nameId: number;
    name: Name;
    categoryId: number;
    repeatType: number;
    repeatLimit: number;
    isDungeonQuest: boolean;
    levelMin: number;
    levelMax: number;
    isPartyQuest: boolean;
    startCriterion: string;
    followable: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface Almanax {
    date: string;
    merydes: string;
    bonus: string;
    description: string;
    offrandes: string;
}

function Quests() {
    const [questCategories, setQuestCategories] = useState<QuestCategorie[]>([]);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [almanax, setAlmanax] = useState<Almanax[]>([]);
    const [filters, setFilters] = useState([
        { id: "displayFinished", label: "Display finished", value: false }
    ]);

    const activeQuests = useAppSelector(selectActiveQuests);
    const finishedQuests = useAppSelector(selectFinishedQuests);
    const reinitDoneQuests = useAppSelector(selectReinitDoneQuests);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/quest-categories.json').then(res => res.json()).then(res => setQuestCategories(res as QuestCategorie[]));
        fetch(process.env.PUBLIC_URL + '/data/quests.json').then(res => res.json()).then(res => setQuests(res as Quest[]));
        fetch(process.env.PUBLIC_URL + '/data/almanax.json').then(res => res.json()).then(res => setAlmanax(res as Almanax[]));
    }, []);

    const isFinishedQuest = (questId: number) => {
        return finishedQuests.includes(questId) || reinitDoneQuests.includes(questId);
    }

    const shouldDisplayQuest = (questId: number) => {
        return filters.find(filter => filter.id === "displayFinished")?.value || !isFinishedQuest(questId);
    }

    const handleFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setFilters(filters.map(filter => event.target.id === filter.id ? { ...filter, value: event.target.checked } : filter));
    }

    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper sx={{ display: "flex", justifyContent: "space-between", padding: (theme) => theme.spacing(1) }}>
                    {filters.map(filter => <Box key={filter.id}>
                        <FormControlLabel label={filter.label} control={<Checkbox id={filter.id} name={filter.id} checked={filter.value} onChange={handleFilterChanged} />} />
                    </Box>)}
                </Paper>
            </Grid>


            <Grid item xs={12}>
                {questCategories.map(categorie => {
                    const categorieQuests = categorie.questIds.filter(questId => shouldDisplayQuest(questId));
                    const isHidden = categorieQuests.length <= 0;

                    return isHidden ? <></> : <Accordion key={categorie.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={"categorie-panel-" + categorie.id}
                            id={"categorie-" + categorie.id}
                        >
                            <Typography>{categorie.name.fr} ({categorieQuests.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <List dense sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)"}}>
                                    {quests.filter(quest => categorieQuests.includes(quest.id)).map(quest => {
                                        const status = activeQuests.includes(quest.id) ? "in-progress" : reinitDoneQuests.includes(quest.id) ? "redoable" : finishedQuests.includes(quest.id) ? "done" : "todo";
                                        const almanaxDate = categorie.id === 31 && quest.name.fr.startsWith("Offrande à ") ? almanax.find(a => quest.name.fr.includes(a.merydes))?.date : "";

                                        return <ListItem sx={{ overflow: "hidden"}}>
                                            <ListItemIcon>
                                                <Avatar
                                                    sx={{ width: 16, height: 16 }}
                                                    alt={status}
                                                    src={`${process.env.PUBLIC_URL}/img/pictos/${status}.svg`}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={<Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Link href={`https://dofusdb.fr/fr/database/quest/${quest.id}`} target="_blank" rel="noreferrer" noWrap>{quest.name.fr}</Link>
                                                    {almanaxDate && <Link href={`https://calendar.google.com/event?action=TEMPLATE&text=${quest.name.fr}&dates=${almanaxDate?.replaceAll("-", "")}/${almanaxDate?.replaceAll("-", "")}&ctz=Europe%2FBrussels&trp=false&sprop=name:`} target="_blank" rel="noreferrer"><Avatar sx={{ width: 16, height: 16 }} src={process.env.PUBLIC_URL + "/img/pictos/calendar.png"} alt={almanaxDate} /></Link>}
                                                </Box>}
                                            />
                                        </ListItem>
                                    })}
                                </List>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                })}
            </Grid>
        </Grid>
    </Box>
}

export default Quests;