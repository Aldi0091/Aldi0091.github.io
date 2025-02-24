import { CandlestickSeries, createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export const ChartComponent = (props) => {
    const {
        data,
        colors: {
            backgroundColor = 'white',
            lineColor = '#2962FF',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 700,
        });

        chart.timeScale().applyOptions({
            locale: 'en-US',
            timeVisible: true,
            secondsVisible: false,
        });
        chart.timeScale().fitContent();

        const newSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });

        newSeries.setData(data);
        
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
          upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
          wickUpColor: '#26a69a', wickDownColor: '#ef5350',
      });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    return (
        <div className="w-full mx-9 bg-gray-800 rounded-lg shadow-lg">
            <div className="text-white text-lg font-semibold text-center mb-4">PoC Charts Build In Progress</div>
            <div className="mb-4" ref={chartContainerRef} />
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
          close: parseFloat(close.toFixed(2))
      });

      open = close + (Math.random() - 0.5) * 5;

      currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

const initialData = generateCandlestickData('2024-06-01', 185);
console.log(initialData);

export default function App(props) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800">
            <ChartComponent {...props} data={initialData} />
        </div>
    );
}