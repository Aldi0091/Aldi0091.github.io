import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { createLineTool } from 'lightweight-charts'; 

export const ChartComponent = (props) => {
    const chartContainerRef = useRef();
    const chartRef = useRef(null); // будем хранить ссылку на ChartApi

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, { /* ...options... */ });
        chartRef.current = chart;

        const candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(props.data);

        return () => chart.remove();
    }, [props.data]);

    const handleDrawTrendLine = () => {
        // ВАЖНО: chartRef.current будет содержать именно расширенный ChartApi
        chartRef.current.setActiveLineTool('TrendLine', {
            color: 'red',
            lineWidth: 2,
        });
    };

    return (
        <div className="w-full mx-9 bg-gray-800 rounded-lg shadow-lg">
            <button className="mb-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
 onClick={handleDrawTrendLine}>
                Draw Trend Line
            </button>
            <div ref={chartContainerRef} style={{ width: '100%', height: 700 }} />
        </div>
    );
};

function generateCandlestickData(startDate, days) {
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

const initialData = generateCandlestickData('2024-01-01', 365);

export default function App(props) {
    return (
        <div className="width-auto min-h-screen flex items-center justify-center bg-gray-800">
            <ChartComponent data={initialData} />
        </div>
    );
}