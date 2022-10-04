import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import styles from './Quests.module.css';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectActiveQuestsIds, 
    selectFinishedQuestsCounts, 
    selectFinishedQuestsIds, 
    selectReinitDoneQuestsIds
} from './questsSlice';

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
    const dispatch = useAppDispatch();
    const [questCategories, setQuestCategories] = useState<QuestCategorie[]>([]);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [almanax, setAlmanax] = useState<Almanax[]>([]);
    const [filters, setFilters] = useState([
        {id: "displayFinished", label: "Display finished", value: true}
    ]);

    const activeQuestsIds = useAppSelector(selectActiveQuestsIds);
    const finishedQuestsCounts = useAppSelector(selectFinishedQuestsCounts);
    const finishedQuestsIds = useAppSelector(selectFinishedQuestsIds);
    const reinitDoneQuestsIds = useAppSelector(selectReinitDoneQuestsIds);
    
    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/quest-categories.json').then(res => res.json()).then(res => setQuestCategories(res as QuestCategorie[]));
        fetch(process.env.PUBLIC_URL + '/data/quests.json').then(res => res.json()).then(res => setQuests(res as Quest[]));
        fetch(process.env.PUBLIC_URL + '/data/almanax.json').then(res => res.json()).then(res => setAlmanax(res as Almanax[]));
    }, []);

    const isFinishedQuest = (questId: number) => {
        return finishedQuestsIds.includes(questId) || reinitDoneQuestsIds.includes(questId);
    }

    const shouldDisplayQuest = (questId: number) => {
        return filters.find(filter => filter.id === "displayFinished")?.value || !isFinishedQuest(questId);
    }

    const handleFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setFilters(filters.map(filter => event.target.id === filter.id ? {...filter, value: event.target.checked} : filter));
    }
        
    return <div className={styles.quests}>
        <div className={styles.quests_filters}>
            {filters.map(filter => <div key={filter.id}>
                <input type="checkbox" id={filter.id} name={filter.id} checked={filter.value} onChange={handleFilterChanged} />
                <label htmlFor={filter.id}>{filter.label}</label>
            </div>)}
        </div>

        <ul className={styles.quests__categories}>
            {questCategories.map(categorie => <li key={categorie.id} className={styles.quests__categorie} data-total={categorie.questIds.filter(questId => shouldDisplayQuest(questId)).length}>
                <button data-open={false} onClick={(event: any) => event.target.dataset.open = !(event.target.dataset.open === "true")}>{categorie.name.fr} ({categorie.questIds.filter(questId => shouldDisplayQuest(questId)).length})</button>

                <ul className={styles.quests__categorie__quests}>
                    {quests.filter(quest => shouldDisplayQuest(quest.id) && categorie.questIds.includes(quest.id)).map(quest => {
                        const almanaxDate = categorie.id === 31 && quest.name.fr.startsWith("Offrande à ") ? almanax.find(a => quest.name.fr.includes(a.merydes))?.date : "";

                        return <li key={quest.id} id={`${quest.id}`} className={styles.quests__categorie__quest} data-active={activeQuestsIds.includes(quest.id)} data-finished={finishedQuestsIds.includes(quest.id)} data-reinit={reinitDoneQuestsIds.includes(quest.id)}>
                            <a className={styles.quests__categorie__quest__link} href={`https://dofusdb.fr/fr/database/quest/${quest.id}`}>{quest.name.fr}</a> 
                            
                            {almanaxDate && <a className={styles.quests__categorie__quest__calendar} href={`https://calendar.google.com/event?action=TEMPLATE&text=${quest.name.fr}&dates=${almanaxDate?.replaceAll("-","")}/${almanaxDate?.replaceAll("-","")}&ctz=Europe%2FBrussels&trp=false&sprop=name:`} target="_blank" rel="nofollow"><img src={process.env.PUBLIC_URL + "/img/pictos/calendar.png"} alt={almanaxDate}/></a>}
                        </li>
                    })}
                </ul>
            </li>)}
        </ul>
    </div>
}

export default Quests;