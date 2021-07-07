export const formatter = new Intl.NumberFormat(
    'en-UK', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }
);