import React, { useEffect, useState } from 'react';
import styles from './Achievements.module.css';

import { useAppSelector } from '../../app/hooks';
import {
    selectFinishedAchievements
} from './achievementsSlice';

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
    const [almanax, setAlmanax] = useState<Almanax[]>([]);
    const [filters, setFilters] = useState([
        {id: "displayFinished", label: "Display finished", value: true},
        {id: "displayMeta", label: "Display meta-achievements", value: true},
        {id: "displayIntermediate", label: "Display intermediate score", value: true},
    ]);

    const finishedAchievements = useAppSelector(selectFinishedAchievements);
    
    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/achievement-categories.json').then(res => res.json()).then(res => setAchievementCategories(res as AchievementCategorie[]));
        fetch(process.env.PUBLIC_URL + '/data/achievements.json').then(res => res.json()).then(res => setAchievements(res as Achievement[]));
        fetch(process.env.PUBLIC_URL + '/data/almanax.json').then(res => res.json()).then(res => setAlmanax(res as Almanax[]));
    }, []);

    const isFinishedAchievement = (achievementId: number) => {
        return finishedAchievements.includes(achievementId);
    }

    const shouldDisplayAchievement = (achievement: Achievement | undefined) => {
        if(!achievement) return false;
        return true &&
            (filters.find(filter => filter.id === "displayFinished")?.value || !isFinishedAchievement(achievement.id)) &&
            (filters.find(filter => filter.id === "displayMeta")?.value || achievement.iconId !== 82) &&
            (filters.find(filter => filter.id === "displayIntermediate")?.value || !achievement.name.fr.match(/Score\s([1]{0,1}[0-9]{0,2})\)$/))
    }

    const handleFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setFilters(filters.map(filter => event.target.id === filter.id ? {...filter, value: event.target.checked} : filter));
    }
        
    return <div className={styles.achievements}>
        <div className={styles.achievements_filters}>
            {filters.map(filter => <div key={filter.id}>
                <input type="checkbox" id={filter.id} name={filter.id} checked={filter.value} onChange={handleFilterChanged} />
                <label htmlFor={filter.id}>{filter.label}</label>
            </div>)}
        </div>

        <ul className={styles.achievements__categories}>
            {achievementCategories.filter(ac => ac.parentId !== 0).map(categorie => <li key={categorie.id} className={styles.achievements__categorie} data-total={categorie.achievementIds.filter(aid => shouldDisplayAchievement(achievements.find(a => a.id === aid))).length}>
                <button data-open={false} onClick={(event: any) => event.target.dataset.open = !(event.target.dataset.open === "true")}>{categorie.name.fr} ({categorie.achievementIds.filter(aid => shouldDisplayAchievement(achievements.find(a => a.id === aid))).length})</button>

                <ul className={styles.achievements__categorie__achievements}>
                    {achievements.filter(achievement => shouldDisplayAchievement(achievement) && categorie.achievementIds.includes(achievement.id)).map(achievement => {
                        return <li key={achievement.id} id={`${achievement.id}`} className={styles.achievements__categorie__achievement} data-finished={finishedAchievements.includes(achievement.id)}>
                            <img src={process.env.PUBLIC_URL + "/img/achievements/" + achievement.iconId + ".png"} alt="" />{achievement.name.fr}
                        </li>
                    })}
                </ul>
            </li>)}
        </ul>
    </div>
}

export default Achievements;