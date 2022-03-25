import React, { useState } from 'react';
import styles from './Chat.module.css';

import { useAppSelector } from '../../app/hooks';
import {
    selectMessages
} from './chatSlice';

function Chat() {
    const messages = useAppSelector(selectMessages);
    const [filters, setFilters] = useState([
        {channel: 0, display: true},
        {channel: 1, display: true},
        {channel: 2, display: true},
        {channel: 3, display: true},
        {channel: 4, display: true},
        {channel: 5, display: true},
        {channel: 6, display: true},
        {channel: 7, display: true},
        {channel: 8, display: true},
        {channel: 9, display: true},
        {channel: 10, display: true},
        {channel: 11, display: true},
        {channel: 12, display: true},
        {channel: 13, display: true},
        {channel: 14, display: true},
        {channel: 15, display: true},
    ]);

    const updateFilters = (channel: number, display: boolean) => {
        // setFilters(filters.map(item => item.channel===channel ? {channel, display}: item));
    }

    return <div>
        <h1>Dofus chat.</h1>
        <div>
            <form>
                {filters.map(filter => <label className={`${styles.chatFilter} ${styles.chatItem}`} data-type={filter.channel} key={filter.channel} htmlFor={`channel-${filter.channel}`}><input type="checkbox" id={`channel-${filter.channel}`} checked={filter.display} onChange={() => updateFilters(filter.channel, !filter.display)} /></label>)}
            </form>
            <ul className={styles.chat}>
                {messages.map((msg, index) => <li className={styles.chatItem} key={msg.id} data-type={msg.channel}><Time timestamp={msg.timestamp} /> <strong>{msg.senderName}</strong> : {msg.content}</li>)}
                {/* {messages.filter(msg => filters.filter(f => f.display).map(f => f.channel).includes(msg.channel)).map((msg, index) => <li className={styles.chatItem} key={index} data-type={msg.channel}><Time timestamp={msg.timestamp} /> <strong>{msg.senderName}</strong> : {msg.content}</li>)} */}
            </ul>
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