export function generateCandlestickData(startDate, days) {
    const data = [];
    let currentDate = new Date(startDate);
    let open = 100;

    for (let i = 0; i < days; i++) {
        const high = open + Math.random() * 10;
        const low = open - Math.random() * 10;
        const close = low + Math.random() * (high - low);

        data.push({
            time: currentDate.toISOString().split('T')[0],
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
        });

        open = close + (Math.random() - 0.5) * 5;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
}
