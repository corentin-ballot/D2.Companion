import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControlLabel, Checkbox, Grid, Typography, Avatar, Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAppSelector } from '../../app/hooks';
import {
    selectFinishedAchievements
} from '../character/characterSlice';
import { url } from 'inspector';

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

export interface AchievementCategorie {
    parentId: number;
    _id: string;
    achievementIds: number[];
    id: number;
    nameId: number;
    name: Name;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface Achievement {
    _id: string;
    stepIds: number[];
    id: number;
    iconId: number;
    nameId: number;
    name: Name;
    categoryId: number;
    repeatType: number;
    repeatLimit: number;
    isDungeonAchievement: boolean;
    levelMin: number;
    levelMax: number;
    isPartyAchievement: boolean;
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

function Achievements() {
    const [achievementCategories, setAchievementCategories] = useState<AchievementCategorie[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [filters, setFilters] = useState([
        { id: "displayFinished", label: "Display finished", value: false },
        { id: "displayMeta", label: "Display meta-achievements", value: false },
    ]);

    const finishedAchievements = useAppSelector(selectFinishedAchievements);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/achievement-categories.json').then(res => res.json()).then(res => setAchievementCategories(res as AchievementCategorie[]));
        fetch(process.env.PUBLIC_URL + '/data/achievements.json').then(res => res.json()).then(res => setAchievements(res as Achievement[]));
    }, []);

    const isFinishedAchievement = (achievementId: number) => {
        return finishedAchievements.includes(achievementId);
    }

    const shouldDisplayAchievement = (achievement: Achievement | undefined) => {
        if (!achievement) return false;
        return true &&
            (filters.find(filter => filter.id === "displayFinished")?.value || !isFinishedAchievement(achievement.id)) &&
            (filters.find(filter => filter.id === "displayMeta")?.value || achievement.iconId !== 82)
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
                {achievementCategories.filter(ac => ac.achievementIds.length >= 0).map(categorie => {
                    const categorieAchievements = categorie.achievementIds.filter(aid => shouldDisplayAchievement(achievements.find(a => a.id === aid)));
                    const isHidden = categorieAchievements.length <= 0;

                    return isHidden ? <></> : <Accordion key={categorie.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={"categorie-panel-" + categorie.id}
                            id={"categorie-" + categorie.id}
                        >
                            <Typography>{categorie.name.fr} ({categorieAchievements.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <List dense sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: (theme) => theme.spacing(2) }}>
                                    {achievements.filter(achievement => categorieAchievements.includes(achievement.id)).map(achievement => (
                                        <ListItem sx={{ overflow: "hidden", backgroundColor: "#3F3F3D", padding: (theme) => theme.spacing(1), borderRadius: (theme) => theme.spacing(1) }} key={achievement.id}>
                                            <ListItemIcon>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{ 
                                                        width: 64, height: 64, marginRight: (theme) => theme.spacing(1), position: "relative",
                                                        "::after": {
                                                            content: '""',
                                                            position: 'absolute',
                                                            width: '100%',
                                                            height: '100%',
                                                            background: `center / contain no-repeat url("${process.env.PUBLIC_URL}/img/pictos/succes.png")`,
                                                        }
                                                    
                                                    }}
                                                    src={process.env.PUBLIC_URL + "/img/achievements/" + achievement.iconId + ".png"}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={<Typography  sx={{ color: "#A6A6A4", fontWeight: "bold"}}>{achievement.name.fr}</Typography>}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                })}
            </Grid>
        </Grid>
    </Box>
}

export default Achievements;