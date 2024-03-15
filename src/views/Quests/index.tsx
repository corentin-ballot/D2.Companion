import React, { useState } from 'react';
import { Box, Paper, FormControlLabel, Checkbox, Link, Grid, Typography, Avatar, Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useDofusQuests from '../../hooks/dofus-data/useDofusQuests';
import useDofusQuestCategories from '../../hooks/dofus-data/useDofusQuestCategories';
import useDofusAlmanaxes from '../../hooks/dofus-data/useDofusAlmanax';
import { useCharacter } from '../../providers/sockets/CharacterContext';

const Quests = () => {
    const questCategories = useDofusQuestCategories().data;
    const quests = useDofusQuests().data;
    const almanaxes = useDofusAlmanaxes().data;
    
    const [filters, setFilters] = useState([
        { id: "displayFinished", label: "Display finished", value: false }
    ]);

    const character = useCharacter();

    const isFinishedQuest = (questId: number) => character.quests.finished?.includes(questId) || character.quests.reinit?.includes(questId);

    const shouldDisplayQuest = (questId: number) => filters.find(filter => filter.id === "displayFinished")?.value || !isFinishedQuest(questId);

    const handleFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setFilters(filters.map(filter => event.target.id === filter.id ? { ...filter, value: event.target.checked } : filter));
    }

    const getQuestStatus = (questId: number) => {
        if (character.quests.active?.includes(questId)) return "in-progress";
        if (character.quests.reinit?.includes(questId)) return "redoable";
        if (character.quests.finished?.includes(questId)) return "done";
        return "todo";
    }

    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper sx={{ display: "flex", justifyContent: "space-between", padding: 1 }}>
                    {filters.map(filter => <Box key={filter.id}>
                        <FormControlLabel label={filter.label} control={<Checkbox id={filter.id} name={filter.id} checked={filter.value} onChange={handleFilterChanged} />} />
                    </Box>)}
                </Paper>
            </Grid>


            <Grid item xs={12}>
                {questCategories?.map(categorie => {
                    const categorieQuests = categorie.questIds.filter(questId => shouldDisplayQuest(questId));
                    const isHidden = categorieQuests.length <= 0;

                    return isHidden ? null : <Accordion key={categorie.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`categorie-panel-${  categorie.id}`}
                            id={`categorie-${  categorie.id}`}
                        >
                            <Typography>{categorie.name} ({categorieQuests.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <List dense sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)"}}>
                                    {quests?.filter(quest => categorieQuests.includes(quest.id)).map(quest => {
                                        const status = getQuestStatus(quest.id);
                                        const almanaxDate = categorie.id === 31 && quest.name.startsWith("Offrande à ") ? almanaxes?.find(a => quest.name.includes(a.merydes))?.date : "";

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
                                                    <Link href={`https://dofusdb.fr/database/quest/${quest.id}`} target="_blank" rel="noreferrer" noWrap>{quest.name}</Link>
                                                    {almanaxDate && <Link href={`https://calendar.google.com/event?action=TEMPLATE&text=${quest.name}&dates=${almanaxDate?.replaceAll("-", "")}/${almanaxDate?.replaceAll("-", "")}&ctz=Europe%2FBrussels&trp=false&sprop=name:`} target="_blank" rel="noreferrer"><Avatar sx={{ width: 16, height: 16 }} src={`${process.env.PUBLIC_URL  }/img/pictos/calendar.png`} alt={almanaxDate} /></Link>}
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