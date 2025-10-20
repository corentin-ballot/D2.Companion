import React, { useEffect, useState } from 'react';
import { Box, Paper, FormControlLabel, Checkbox, GridLegacy, Typography, Avatar, Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// @ts-ignore
import { exportCsv } from "json2csv-export";
import { useCharacter } from '../../providers/sockets/CharacterContext';
import useDofusAchievements, { Achievement } from '../../hooks/dofus-data/.useDofusAchievements';
import useDofusAchievementCategories, { AchievementCategory } from '../../hooks/dofus-data/.useDofusAchievementCategories';

const Achievements = () => {
    const [achievementIds, setAchievementIds] = useState<any[]>([]);
    const achievements = useDofusAchievements().data
    const achievementCategories = useDofusAchievementCategories().data
    const [filters, setFilters] = useState([
        { id: "displayFinished", label: "Display finished", value: false },
        { id: "displayMeta", label: "Display meta-achievements", value: false },
    ]);

    const character = useCharacter()

    useEffect(() => {
        if (typeof achievementCategories !== "undefined") {
            setAchievementIds(achievementCategories.reduce((a: any[], b: any) => {
                const parent = a.find(ac => ac.id === b.parentId) || achievementCategories.find(ac => ac.id === b.parentId);
                const obj = typeof parent === "undefined" ? { ...b, subAchievements: [], subAchievementIds: [] } : {
                    ...parent,
                    subAchievements: [...(parent.subAchievements ?? []), b].sort((c, d) => c.order - d.order),
                    subAchievementIds: [...(parent.subAchievementIds ?? []), ...b.achievementIds],
                };

                return [
                    ...a.filter(ac => ac.id !== obj.id),
                    obj
                ]
            }, []).sort((a, b) => a.order - b.order));
        }
    }, [achievementCategories])

    const isFinishedAchievement = (achievementId: number) => character.achievements.finished.includes(achievementId)

    const shouldDisplayAchievement = (achievement: Achievement | undefined) => {
        if (!achievement) return false;
        return true &&
            (filters.find(filter => filter.id === "displayFinished")?.value || !isFinishedAchievement(achievement.id)) &&
            (filters.find(filter => filter.id === "displayMeta")?.value || achievement.iconId !== 82)
    }

    const handleFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(filters.map(filter => event.target.id === filter.id ? { ...filter, value: event.target.checked } : filter));
    }

    const exportSheet = (categorie: AchievementCategory) => {
        exportCsv({
            header: {
                name: "Succès",
                state: character.infos.name,
            },
            // @ts-ignore
            data: [...categorie.achievementIds, ...(categorie.subAchievementIds || [])].map(aid => {
                const achievement = achievements?.find(a => a.id === aid);
                const achievementCategorie = achievementCategories?.find(ac => ac.id === achievement?.categoryId);
                return {
                    name: achievement?.name,
                    state: character.achievements.finished.includes(aid) ? 1 : 0,
                    order: !achievement || !achievementCategorie ? 0 : (achievementCategorie?.order ?? 0) * 1e3 + (achievement?.order ?? 0),
                }
            }).sort((a, b) => a.order - b.order),
            filename: "D2Companion - Achievements",
        });
    }

    return <Box sx={{ flexGrow: 1 }}>
        <GridLegacy container spacing={2}>
            {/* Filters */}
            <GridLegacy item xs={12}>
                <Paper sx={{ display: "flex", justifyContent: "space-between", padding: 1 }}>
                    {filters.map(filter => <Box key={filter.id}>
                        <FormControlLabel label={filter.label} control={<Checkbox id={filter.id} name={filter.id} checked={filter.value} onChange={handleFilterChanged} />} />
                    </Box>)}
                </Paper>
            </GridLegacy>


            <GridLegacy item xs={12}>
                {achievementIds.map((categorie: AchievementCategory) => {
                    const categorieAchievements = categorie.achievementIds.filter(aid => shouldDisplayAchievement(achievements?.find(a => a.id === aid)));
                    // @ts-ignore
                    const categorieSubAchievements = categorie.subAchievementIds?.filter(aid => shouldDisplayAchievement(achievements?.find(a => a.id === aid)));
                    const isHidden = categorieAchievements.length + (categorieSubAchievements ? categorieSubAchievements.length : 0) <= 0;

                    return isHidden ? null : <Accordion key={categorie.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`categorie-panel-${  categorie.id}`}
                            id={`categorie-${  categorie.id}`}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <Typography>{categorie.name} ({categorieAchievements.length + (categorieSubAchievements ? categorieSubAchievements.length : 0)})</Typography>
                                <Button onClick={(e: any) => { e.stopPropagation(); exportSheet(categorie) }}>Export</Button>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            {categorieAchievements.length > 0 && <List dense sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                                {achievements?.filter(achievement => categorieAchievements.includes(achievement.id)).map(achievement => (
                                    <ListItem sx={{ overflow: "hidden", backgroundColor: "#3F3F3D", padding: 1, borderRadius: 1 }} key={achievement.id}>
                                        <ListItemIcon>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 64, height: 64, marginRight: 1, position: "relative",
                                                    "::after": {
                                                        content: '""',
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        background: `center / contain no-repeat url("${process.env.PUBLIC_URL}/img/pictos/succes.png")`,
                                                    }

                                                }}
                                                src={`http://localhost:3960/images/achievements/${achievement.iconId}`}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography sx={{ color: "#A6A6A4", fontWeight: "bold" }}>{achievement.name}</Typography>}
                                        />
                                    </ListItem>
                                ))}
                            </List>}

                            {/* @ts-ignore */}
                            {categorie.subAchievements?.map(subcat => {
                                const subcatAchievements = subcat.achievementIds.filter((aid: any) => shouldDisplayAchievement(achievements?.find(a => a.id === aid)));
                                const isSubcatHidden = subcatAchievements.length <= 0;

                                return !isSubcatHidden && <Box>
                                    <Typography variant="body2">{subcat.name}</Typography>
                                    <List dense sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                                        {achievements?.filter(achievement => subcatAchievements.includes(achievement.id)).map(achievement => (
                                            <ListItem sx={{ overflow: "hidden", backgroundColor: "#3F3F3D", padding: 1, borderRadius: 1 }} key={achievement.id}>
                                                <ListItemIcon>
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{
                                                            width: 64, height: 64, marginRight: 1, position: "relative",
                                                            "::after": {
                                                                content: '""',
                                                                position: 'absolute',
                                                                width: '100%',
                                                                height: '100%',
                                                                background: `center / contain no-repeat url("${process.env.PUBLIC_URL}/img/pictos/succes.png")`,
                                                            }

                                                        }}
                                                        src={`http://localhost:3960/images/achievements/${achievement.iconId}`}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography sx={{ color: "#A6A6A4", fontWeight: "bold" }}>{achievement.name}</Typography>}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            })}
                        </AccordionDetails>
                    </Accordion>
                })}
            </GridLegacy>
        </GridLegacy>
    </Box>
}

export default Achievements;