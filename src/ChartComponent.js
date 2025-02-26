import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export const ChartComponent = (props) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const middleLineRef = useRef(null);
  const subBottomLineRef = useRef(null);

  const [benchmarkDrawn, setBenchmarkDrawn] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'black' },
        textColor: 'white',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.1)' },
        horzLines: { color: 'rgba(255,255,255,0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 700,
    });
    chart.applyOptions({
      timeScale: {
        rightOffset: 0,
        barSpacing: 10,
        fixLeftEdge: true,
        fixRightEdge: true,
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (timestamp) => {
          const date = new Date(timestamp * 1000);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      }
    });
    chart.timeScale().fitContent();
    
    chartRef.current = chart;
    
    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(props.data);
    candleSeriesRef.current = candleSeries;
    
    const updateMiddleLineHandler = (params) => {
      if (!topLineRef.current) {
        topLineRef.current = params.selectedLineTool;
        return;
      }
      if (params.selectedLineTool.id === topLineRef.current.Og.ji) {
        const newTopPrice = params.selectedLineTool.points[0].price;
        const fixedBottomPrice = bottomLineRef.current.Og.Ls[0].price;
        const ratio = 0.2;
        const newMiddlePrice = fixedBottomPrice + ratio * (newTopPrice - fixedBottomPrice);

        chart.removeLineToolsById([middleLineRef.current ? middleLineRef.current.Og.ji : '']);
        middleLineRef.current = chart.addLineTool(
          "HorizontalLine",
          [{ price: newMiddlePrice }],
          {
            "line": {
              "color": "#FF0000",
              "width": 1,
              "style": 0,
            },
          }
        );
      } else if (params.selectedLineTool.id === bottomLineRef.current.Og.ji) {
        const newBottomPrice = params.selectedLineTool.points[0].price;
        const subDelta = 15;
        const newSubBottomPrice = newBottomPrice - subDelta;
        chart.removeLineToolsById([subBottomLineRef.current ? subBottomLineRef.current.Og.ji : '']);
        subBottomLineRef.current = chart.addLineTool(
          "HorizontalLine",
          [{ price: newSubBottomPrice }],
          {
            "line": {
              "color": "#00FF00",
              "width": 1,
              "style": 0,
            },
          }
        );
      }
    };
    
    chart.subscribeLineToolsAfterEdit(updateMiddleLineHandler);
    
    return () => {
      chart.unsubscribeLineToolsAfterEdit(updateMiddleLineHandler);
      chart.remove();
    };
  }, [props.data]);
  
  const handleDrawLine = () => {
    if (!chartRef.current) return;
    chartRef.current.setActiveLineTool('HorizontalLine', {
      color: 'red',
      lineWidth: 2,
    });
    
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
    const clickHandler = (params) => {
      chart.removeAllLineTools();
      
      const clickPrice = candleSeries.coordinateToPrice(params.point.y);
      
      const diff = 25;      
      const ratio = 0.2;    
      const subDelta = 10;  
      
      const benchmarkPrice = clickPrice;
      const newBottomPrice = benchmarkPrice - diff;
      const newMiddlePrice = newBottomPrice + ratio * (benchmarkPrice - newBottomPrice);
      const newSubBottomPrice = newBottomPrice - subDelta;
      
      topLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: benchmarkPrice }],
        {
          "line": {
            "color": "#2962FF",
            "width": 1,
            "style": 0,
          },
        }
      );
      
      bottomLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: newBottomPrice }],
        {
          "line": {
            "color": "#2962FF",
            "width": 1,
            "style": 0,
          },
        }
      );
      
      middleLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: newMiddlePrice }],
        {
          "line": {
            "color": "#FF0000",
            "width": 1,
            "style": 0,
          },
        }
      );
      
      subBottomLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: newSubBottomPrice }],
        {
          "line": {
            "color": "#00FF00",
            "width": 1,
            "style": 0,
          },
        }
      );
      
      chart.unsubscribeClick(clickHandler);
      setBenchmarkDrawn(true);
    };
    
    chartRef.current.subscribeClick(clickHandler);
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-lg relative">
      <div className="mx-4 bg-gray-800 rounded-lg shadow-lg relative">
        <h1 className="text-2xl font-bold text-white mb-2">PoC Trading Chart</h1>
        <p className="text-gray-300 mb-6">
          Click the button then click on the chart to draw benchmark lines.
        </p>
        <button 
          className="mb-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={handleDrawLine}
        >
          Draw Lines
        </button>
      </div>
      
      <div className="mx-4">
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default ChartComponent;
