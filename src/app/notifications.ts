export default class Notifications {

    message: string;
    username: string | null;
    isNativeNotificationEnable: boolean;
    isDiscordNotificationEnable: boolean;
    discordWebhook: string | null;
    payload: any[];

    constructor(message: string, username: string | null = null, webhook: string | null = null, payload: any[] | null = null) {
        this.message = message;
        this.isNativeNotificationEnable = JSON.parse(localStorage.getItem("notifications.native") || "true");
        this.isDiscordNotificationEnable = JSON.parse(localStorage.getItem("notifications.discord.enable") || "true");
        this.discordWebhook = webhook ? webhook : JSON.parse(localStorage.getItem("notifications.discord.webhook") || "null");
        this.username = username;
        this.payload = payload ? payload : [];

        // Request Notification Permission
        if ('Notification' in window && Notification.permission !== 'denied' && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    };

    send() {
        if (this.isNativeNotificationEnable && Notification.permission === 'granted') {
            this.sendNative();
        }

        if (this.isDiscordNotificationEnable && this.discordWebhook !== null) {
            this.sendDiscord();
        }
    };

    sendNative() {
        new Notification((this.username ? this.username + " : " : "") + this.message);
    }

    sendDiscord() {
        if (this.discordWebhook !== null) {
            const content = {
                content: this.message,
                username: this.username,
                embeds: this.payload,
                // tts: true,
                // content: "Hello <@247675082699309058> !",
                // embeds: [{
                //    title: undefined,
                //    description: undefined,
                //    footer: {
                //        text: undefined
                //    }
                // }]
            };
            
            fetch(this.discordWebhook, {
                method: "POST",
                body: JSON.stringify(content),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
}

