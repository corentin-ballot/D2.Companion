import React, { useState } from 'react';
import Notifications from '../../app/notifications';
import styles from './Settings.module.css';

function Settings() {
    const [nativeNotifications, setNativeNotifications] = useState(JSON.parse(localStorage.getItem("notifications.native") || "true"));
    const [discordNotifications, setDiscordNotifications] = useState(JSON.parse(localStorage.getItem("notifications.discord.enable") || "true"));
    const [housesSellableNotifications, setHousesSellableNotifications] = useState(JSON.parse(localStorage.getItem("notifications.houses.sellable") || "true"));
    const [discordWebhook, setDiscordWebhook] = useState(JSON.parse(localStorage.getItem("notifications.discord.webhook") || "null"));
    // const [discordUsername, setDiscordUsername] = useState(JSON.parse(localStorage.getItem("notifications.discord.username") || "null"));

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem(event.target.id, JSON.stringify(event.target.type === "checkbox" ? event.target.checked : event.target.value));
        if (event.target.id === "notifications.native") setNativeNotifications(event.target.checked);
        if (event.target.id === "notifications.discord.enable") setDiscordNotifications(event.target.checked);
        if (event.target.id === "notifications.discord.webhook") setDiscordWebhook(event.target.value);
        if (event.target.id === "notifications.houses.sellable") setHousesSellableNotifications(event.target.value);
        // if (event.target.id === "notifications.discord.username") setDiscordUsername(event.target.value);
    }
    
    
    return <div className={styles.settings}>
        <section>
            <h3>Notifications</h3>

            <section>
                <h4>Browser notifications</h4>
                <div className="input__container">
                    <input type="checkbox" id="notifications.native" checked={nativeNotifications} onChange={handleInputChange} />
                    <label htmlFor="notifications.native">Enable browser notifications</label>
                </div>

                <button onClick={() => new Notifications("Test").sendNative()}>Test</button>
            </section>
            
            <section>
                <h4>Discord notifications</h4>
                <div className="input__container">
                    <input type="checkbox" id="notifications.discord.enable" checked={discordNotifications} onChange={handleInputChange} />
                    <label htmlFor="notifications.discord.enable">Enable discord notifications</label>
                </div>    
                
                <div className="input__container">
                    <input type="text" id="notifications.discord.webhook" onChange={handleInputChange} defaultValue={discordWebhook} placeholder=" " />
                    <label htmlFor="notifications.discord.webhook">Discord webhook</label>
                </div>

                <button onClick={() => new Notifications("Test").sendDiscord()}>Test</button>
            </section>
            
            <section>
                <h4>Discord notifications</h4>
                <div className="input__container">
                    <input type="checkbox" id="notifications.houses.sellable" checked={discordNotifications} onChange={handleInputChange} />
                    <label htmlFor="notifications.houses.sellable">Enable abandonned house sellable notification</label>
                </div>

                <button onClick={() => new Notifications("Test").sendDiscord()}>Test</button>
            </section>
        </section>
        
    </div>
}

export default Settings;