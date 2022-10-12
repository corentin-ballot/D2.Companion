import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import styles from './Chat.module.css';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    Notification,
    Redirection,
    selectMessages,
    selectNotifications,
    selectRedirections,
    updateNotifications,
    updateRedirections
} from './chatSlice';
import DateTime from '../../components/dateTime/DateTime';

interface DataObject {
    id: number;
    name: string;
}

const data = {monsters: [] as DataObject[], weapons: [] as DataObject[], equipments: [] as DataObject[], achievements: [] as DataObject[], others: [] as DataObject[]}
const MAX_AUTO_COMPLETE_RESULT = 10;

function Chat() {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(selectNotifications);
    const redirections = useAppSelector(selectRedirections);
    const messages = useAppSelector(selectMessages);
    const inputNotificationRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const inputWebhookRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const inputChannelRef: MutableRefObject<HTMLSelectElement | null> = useRef(null);
    
    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/monsters.json').then(res => res.json()).then((res: {Id: number, Name: string}[]) => data.monsters = res.map(r => ({id: r.Id, name: r.Name})));
        fetch(process.env.PUBLIC_URL + '/data/weapons.json').then(res => res.json()).then((res: {_id: number, name: string}[]) => data.weapons = res.map(r => ({id: r._id, name: r.name})));
        fetch(process.env.PUBLIC_URL + '/data/equipments.json').then(res => res.json()).then((res: {_id: number, name: string}[]) => data.equipments = res.map(r => ({id: r._id, name: r.name})));
        fetch(process.env.PUBLIC_URL + '/data/achievements.json').then(res => res.json()).then((res: {id: number, name: any}[]) => data.achievements = res.map(r => ({id: r.id, name: r.name.fr})));
    }, []);
        
    const scopes = ["monsters","equipments","weapons","achievements", "others"] as const;
    const [selectedScope, setSelectedScope] = useState(scopes[0] as typeof scopes[number]);
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedScope(event.target.value as typeof scopes[number]);
    }

    const [autoCompleteResult, setAutoCompleteResult] = useState([] as any[]);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const proposals = data[selectedScope].filter(d => d.name.toLowerCase().includes(event.target.value.toLowerCase()));
        setAutoCompleteResult(proposals);

        if(inputNotificationRef.current) {
            inputNotificationRef.current.removeAttribute("data-id");
        };
    }

    const handleProposalClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        const result = autoCompleteResult.find(res => res.id == (event.target as HTMLButtonElement).getAttribute("data-value"));
        if(inputNotificationRef.current) {
            inputNotificationRef.current.value = result.name;
            inputNotificationRef.current.setAttribute("data-id", result.id);
        };
    }

    const handleRemoveNotificationClicked = (notification: Notification) => {
        const ns = notifications.filter(n => n.label !== notification.label);
        dispatch(updateNotifications(ns));
    }

    const handleAddNotificationClicked = () => {
        if(inputNotificationRef.current) {
            const n = {label: inputNotificationRef.current.value, matches: [inputNotificationRef.current.value.toLocaleLowerCase()]};
            if(inputNotificationRef.current.hasAttribute("data-id")) {
                if(selectedScope === "monsters") {
                    n.matches.push(`{chatmonster,${inputNotificationRef.current.getAttribute("data-id")}}`);
                } else if (selectedScope === "achievements") {
                    n.matches.push(`{chatachievement,${inputNotificationRef.current.getAttribute("data-id")}}`);
                } else {
                    n.matches.push(`${inputNotificationRef.current.getAttribute("data-id")}`);
                }
            }
            const ns = [...notifications, n];
            dispatch(updateNotifications(ns));
        }
    }

    const handleRemoveRedirectionClicked = (redirection: Redirection) => {
        const rs = redirections.filter(r => r.channel !== redirection.channel && r.webhook !== redirection.webhook);
        dispatch(updateRedirections(rs));
    }

    const handleAddRedirectionClicked = () => {
        if(inputWebhookRef.current && inputChannelRef.current) {
            const r:Redirection = {channel: Number.parseInt(inputChannelRef.current.value), webhook: inputWebhookRef.current.value};
            const rs = [...redirections, r];
            dispatch(updateRedirections(rs));
        }
    }

    return <div className={styles.chat}>
        <div className={styles.chat__notifications}>
            <h3>Notifications</h3>
            <div className={styles.chat__header}>
                <div className={styles.chat__header__form}>
                    <select value={selectedScope} onChange={handleSelectChange}>
                        {scopes.map(scope => <option key={scope} value={scope}>{scope.charAt(0).toLocaleUpperCase() + scope.substr(1).replaceAll("_"," ")}</option>)}
                    </select>
                    <div className={styles.chat__header__form__input}>
                        <input type="text" ref={inputNotificationRef} onChange={handleInputChange} onFocus={handleInputChange} />
                        <div className={styles.chat__header__form__input__proposals}>
                            {autoCompleteResult.filter((res, index) => index < MAX_AUTO_COMPLETE_RESULT).map(res => 
                                <button className={styles.chat__header__form__input__proposals__item} key={res.id} data-value={res.id} onClick={handleProposalClicked}>{res.name}</button>    
                            )}
                        </div>
                    </div>
                    <button className={styles.market__header__filter__add__btn} onClick={handleAddNotificationClicked}>Add notification</button>
                </div>
            </div>


            {/* No chat notification to display */}
            {notifications.length === 0 &&
                <div className={styles.no_chat_notifications}>
                    Add some things to get notified if it's mentionned in chat.
                </div>
            }
            
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
                                <td><button onClick={() => handleRemoveNotificationClicked(notification)}>remove</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>}
                {/* {<div><pre>Notifications : {JSON.stringify(notifications, null, 2) }</pre></div>} */}
            </div>

            <div className={styles.history}>
                {messages.map((message) => {
                    const content = message.objects ? message.objects.reduce((_content, object) => _content.replace("\ufffc", `[${data.equipments.find(e => e.id === object.objectGID)?.name}]`), message.content) : message.content;

                    return <div className={styles.message} key={message.id}>
                        <span className={styles.message__time}><DateTime timestamp={message.timestamp}/></span>
                        <a className={styles.message__sender} onClick={() => navigator.clipboard.writeText(`/w ${message.senderName} `)}>{message.senderName}</a>
                        <span className={styles.message__content}>{content}</span>
                    </div>
                    }
                )}
            </div>
        </div>

        <div className={styles.chat__redirection}>
            <h3>Redirection</h3>
            <div className={styles.chat__header}>
                <div className={styles.chat__header__form}>
                    <select ref={inputChannelRef}>
                        <option value="2">Guilde</option>
                        <option value="6">Recrutement</option>
                    </select>
                    <div className={styles.chat__header__form__input}>
                        <input type="text" ref={inputWebhookRef} placeholder="Discord webhook" />
                    </div>
                    <button className={styles.market__header__filter__add__btn} onClick={handleAddRedirectionClicked}>Add redirection</button>
                </div>
            </div>


            {/* No chat notification to display */}
            {redirections.length === 0 &&
                <div className={styles.no_chat_notifications}>
                    Add some things to get your chat redirected in Discord.
                </div>
            }
            
            <div className={styles.chat__notifications}>
                {redirections.length > 0 && <table className={styles.chat__notifications__table}>
                    <thead>
                        <tr>
                            <th>Channel</th>
                            <th>Discord webhook</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {redirections.map((redirection) => 
                            <tr key={redirection.channel + "-" + redirection.webhook}>
                                <td>{redirection.channel}</td>
                                <td>{redirection.webhook}</td>
                                <td><button onClick={() => handleRemoveRedirectionClicked(redirection)}>remove</button></td>
                            </tr>
                        )}
                    </tbody>
                </table>}
                {/* {<div><pre>Notifications : {JSON.stringify(notifications, null, 2) }</pre></div>} */}
            </div>
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