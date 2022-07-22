import React, { MutableRefObject, useRef, useState } from 'react';
import styles from './Chat.module.css';
// import equipments from '../../data/equipments.json';
// import weapons from '../../data/weapons.json';
// import monsters from '../../data/monsters.json';

import { useAppSelector } from '../../app/hooks';
import {
    selectNotifications
} from './chatSlice';

interface DataObject {
    id: number;
    name: string;
}

interface Notification {
    label: string;
    matches: string[];
}

const MAX_AUTO_COMPLETE_RESULT = 10;

function Chat() {
    const [notifications, setNotification] = useState(useAppSelector(selectNotifications));
    const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    
    const data = {monsters: [] as DataObject[], weapons: [] as DataObject[], equipments: [] as DataObject[], others: [] as DataObject[]}
    fetch('/data/monsters.json').then(res => res.json()).then((res: {Id: number, Name: string}[]) => data.monsters = res.map(r => ({id: r.Id, name: r.Name})));
    fetch('/data/weapons.json').then(res => res.json()).then((res: {_id: number, name: string}[]) => data.weapons = res.map(r => ({id: r._id, name: r.name})));
    fetch('/data/equipments.json').then(res => res.json()).then((res: {_id: number, name: string}[]) => data.equipments = res.map(r => ({id: r._id, name: r.name})));
    
    
    const scopes = ["monsters","equipments","weapons","others"] as const;
    const [selectedScope, setSelectedScope] = useState(scopes[0] as typeof scopes[number]);
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedScope(event.target.value as typeof scopes[number]);
    }

    const [autoCompleteResult, setAutoCompleteResult] = useState([] as any[]);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAutoCompleteResult(data[selectedScope].filter(d => d.name.toLowerCase().includes(event.target.value.toLowerCase())));

        if(inputRef.current) {
            inputRef.current.removeAttribute("data-id");
        };
    }

    const handleProposalClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        const result = autoCompleteResult.find(res => res.id == (event.target as HTMLButtonElement).getAttribute("data-value"));
        if(inputRef.current) {
            inputRef.current.value = result.name;
            inputRef.current.setAttribute("data-id", result.id);
        };
    }

    const handleRemoveClicked = (notification: Notification) => {
        const ns = notifications.filter(n => n.label !== notification.label);
        setNotification(ns);
        localStorage.setItem('chat.notifications', JSON.stringify(ns));
    }

    const handleAddClicked = () => {
        if(inputRef.current) {
            const n = {label: inputRef.current.value, matches: [inputRef.current.value.toLocaleLowerCase()]};
            if(inputRef.current.hasAttribute("data-id")) n.matches.push(selectedScope === "monsters" ? `{chatmonster,${inputRef.current.getAttribute("data-id")}}` : `${inputRef.current.getAttribute("data-id")}`);
            const ns = [...notifications, n];
            setNotification(ns);
            localStorage.setItem('chat.notifications', JSON.stringify(ns));
        }
    }

    return <div className={styles.chat}>
        <div className={styles.chat__header}>
            <div className={styles.chat__header__form}>
                <select value={selectedScope} onChange={handleSelectChange}>
                    {scopes.map(scope => <option key={scope} value={scope}>{scope.charAt(0).toLocaleUpperCase() + scope.substr(1).replaceAll("_"," ")}</option>)}
                </select>
                <div className={styles.chat__header__form__input}>
                    <input type="text" ref={inputRef} onChange={handleInputChange} onFocus={handleInputChange} />
                    <div className={styles.chat__header__form__input__proposals}>
                        {autoCompleteResult.filter((res, index) => index < MAX_AUTO_COMPLETE_RESULT).map(res => 
                            <button className={styles.chat__header__form__input__proposals__item} key={res.id} data-value={res.id} onClick={handleProposalClicked}>{res.name}</button>    
                        )}
                    </div>
                </div>
                <button className={styles.market__header__filter__add__btn} onClick={handleAddClicked}>Add notification</button>
            </div>
        </div>

        
        <div className={styles.chat__notifications}>
            {notifications.length > 0 && <table className={styles.chat__notifications__table}>
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Matches</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map((notification, index) => 
                        <tr key={notification.label + "-" + index}>
                            <td>{notification.label}</td>
                            <td>{notification.matches.join(", ")}</td>
                            <td><button onClick={() => handleRemoveClicked(notification)}>remove</button></td>
                        </tr>
                    )}
                </tbody>
            </table>}
            {/* {<div><pre>Notifications : {JSON.stringify(notifications, null, 2) }</pre></div>} */}
        </div>
    </div>
}

interface TimeProps {
    timestamp: number;
}

function Time(props:TimeProps) {
    const date = new Date(props.timestamp*1000);
    const formater = new Intl.DateTimeFormat('fr-FR', { hour: "2-digit", minute: "2-digit" })

    return <span className={styles.chatItemTime}>[{formater.format(date)}]</span>
}

export default Chat;