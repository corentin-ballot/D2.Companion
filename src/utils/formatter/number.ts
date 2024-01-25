/* eslint-disable import/prefer-default-export */

export const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");