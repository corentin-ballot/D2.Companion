import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControlLabel, Checkbox, Grid, Typography, Avatar, Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// @ts-ignore
import { exportCsv } from "json2csv-export";

import { useAppSelector } from '../../app/hooks';
import {
    selectCharacter,
    selectFinishedAchievements
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

export interface AchievementCategorie {
    subAchievements?: AchievementCategorie[];
    subAchievementIds?: number[];
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
    order: number;
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
    const [acids, setAcids] = useState<AchievementCategorie[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [filters, setFilters] = useState([
        { id: "displayFinished", label: "Display finished", value: false },
        { id: "displayMeta", label: "Display meta-achievements", value: false },
    ]);

    const character = useAppSelector(selectCharacter);

    const finishedAchievements = useAppSelector(selectFinishedAchievements);

    useEffect(() => {
        setAcids(achievementCategories.reduce((a, b) => {
            const parent = a.find(ac => ac.id === b.parentId) || achievementCategories.find(ac => ac.id === b.parentId);
            const obj = typeof parent === "undefined" ? { ...b, subAchievements: [], subAchievementIds: [] } : {
                ...parent,
                // @ts-ignore
                subAchievements: [...parent.subAchievements, b].sort((a, b) => a.order - b.order),
                // @ts-ignore
                subAchievementIds: [...parent.subAchievementIds, ...b.achievementIds],
            };

            return [
                ...a.filter(ac => ac.id !== obj.id),
                obj
            ]
        }, [] as AchievementCategorie[]).sort((a, b) => a.order - b.order));
    }, [achievementCategories])

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

    const exportSheet = (categorie: AchievementCategorie) => {
        exportCsv({
            header: {
                name: "Succès",
                state: character.name,
            },
            data: [...categorie.achievementIds, ...(categorie.subAchievementIds || [])].map(aid => {
                const achievement = achievements.find(a => a.id === aid);
                const achievementCategorie = achievementCategories.find(ac => ac.id === achievement?.categoryId);
                return {
                    name: achievement?.name.fr,
                    state: character.achievements.finished.includes(aid) ? 1 : 0,
                    order: !achievement || !achievementCategorie ? 0 : achievementCategorie?.order * 1e3 + achievement?.order,
                }
            }).sort((a, b) => a.order - b.order),
            filename: "D2Companion - Achievements",
        });
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
                {acids.map((categorie: AchievementCategorie) => {
                    const categorieAchievements = categorie.achievementIds.filter(aid => shouldDisplayAchievement(achievements.find(a => a.id === aid)));
                    const categorieSubAchievements = categorie.subAchievementIds?.filter(aid => shouldDisplayAchievement(achievements.find(a => a.id === aid)));
                    const isHidden = categorieAchievements.length + (categorieSubAchievements ? categorieSubAchievements.length : 0) <= 0;

                    return isHidden ? <></> : <Accordion key={categorie.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={"categorie-panel-" + categorie.id}
                            id={"categorie-" + categorie.id}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <Typography>{categorie.name.fr} ({categorieAchievements.length + (categorieSubAchievements ? categorieSubAchievements.length : 0)})</Typography>
                                <Button onClick={(e) => { e.stopPropagation(); exportSheet(categorie) }}>Export</Button>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            {categorieAchievements.length > 0 && <List dense sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: (theme) => theme.spacing(2) }}>
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
                                            primary={<Typography sx={{ color: "#A6A6A4", fontWeight: "bold" }}>{achievement.name.fr}</Typography>}
                                        />
                                    </ListItem>
                                ))}
                            </List>}

                            {categorie.subAchievements?.map(subcat => {
                                const subcatAchievements = subcat.achievementIds.filter(aid => shouldDisplayAchievement(achievements.find(a => a.id === aid)));
                                const isSubcatHidden = subcatAchievements.length <= 0;

                                return !isSubcatHidden && <Box>
                                    <Typography variant="body2">{subcat.name.fr}</Typography>
                                    <List dense sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: (theme) => theme.spacing(2) }}>
                                        {achievements.filter(achievement => subcatAchievements.includes(achievement.id)).map(achievement => (
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
                                                    primary={<Typography sx={{ color: "#A6A6A4", fontWeight: "bold" }}>{achievement.name.fr}</Typography>}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            })}
                        </AccordionDetails>
                    </Accordion>
                })}
            </Grid>
        </Grid>
    </Box>
}

export default Achievements;