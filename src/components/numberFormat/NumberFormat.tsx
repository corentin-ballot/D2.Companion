import React from 'react';

interface NumberFormatProps {
    value: number;
}

function NumberFormat(props: NumberFormatProps) {
    return <span data-timestamp={props.value}>{numberWithSpaces(props.value)}</span>
}

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default NumberFormat;