import React from 'react';

interface DateTimeProps {
    timestamp: number;
}

function DateTime(props: DateTimeProps) {
    const date = new Date(props.timestamp);
    const formatedDateTime = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit'}).format(date);
    return <span data-timestamp={props.timestamp}>[{formatedDateTime}]</span>
}

export default DateTime;