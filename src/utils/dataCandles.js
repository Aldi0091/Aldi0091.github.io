export function generateMinutelyCandlestickData() {
    const now = new Date();
    const startDate = new Date(now.getTime() - 2 * 60 * 60 * 1000); // два часа назад
    const data = [];
    let currentDate = new Date(startDate);
    let open = 100;
  
    while (currentDate <= now) {
      const high = open + Math.random() * 10;
      const low = open - Math.random() * 10;
      const close = low + Math.random() * (high - low);
  
      data.push({
        time: Math.floor(currentDate.getTime() / 1000), // Unix timestamp (секунды)
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      });
  
      open = close + (Math.random() - 0.5) * 5;
      currentDate.setMinutes(currentDate.getMinutes() + 1);
    }
  
    return data;
  }
  