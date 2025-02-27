import React, { useEffect, useRef, useState } from 'react';
import { handleDrawLong } from './draw/longSet';
import { handleDrawShort } from './draw/shortSet';

import { updateLongPositions } from './edit/longEditing';
import { createConfiguredChart } from './chartCreation';

export const ChartComponent = (props) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const middleLineRef = useRef(null);
  const subBottomLineRef = useRef(null);

  const initialTopPriceRef = useRef(null);
  const initialSubBottomPriceRef = useRef(null);

  const subDeltaRef = useRef(15);

  const [benchmarkDrawn, setBenchmarkDrawn] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createConfiguredChart(chartContainerRef.current);
    chartRef.current = chart;
    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(props.data);
    candleSeriesRef.current = candleSeries;

    chart.subscribeLineToolsAfterEdit((params) =>
      updateLongPositions(
        params,
        chart,
        topLineRef,
        bottomLineRef,
        middleLineRef,
        subBottomLineRef,
        initialTopPriceRef,
        initialSubBottomPriceRef,
        subDeltaRef
      )
    );

    return () => {
      chart.unsubscribeLineToolsAfterEdit();
      chart.remove();
    };
  }, [props.data]);

  const onDrawLong = () => {
    handleDrawLong({
      chartRef,
      candleSeriesRef,
      topLineRef,
      bottomLineRef,
      middleLineRef,
      subBottomLineRef,
      initialTopPriceRef,
      initialSubBottomPriceRef,
      setBenchmarkDrawn,
    });
  };

  const onDrawShort = () => {
    handleDrawShort({
      chartRef,
      candleSeriesRef,
      topLineRef,
      bottomLineRef,
      middleLineRef,
      subBottomLineRef,
      initialTopPriceRef,
      initialSubBottomPriceRef,
      setBenchmarkDrawn,
    });
  }

  const handleClearLines = () => {
    if (!chartRef.current) return;
    chartRef.current.removeAllLineTools();
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
          onClick={onDrawLong}
        >
          Long
        </button>
        <button 
          className="mb-4 mx-2 px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow-md hover:bg-yellow-500 transition"
          onClick={onDrawShort}
        >
          Short
        </button>
        <button 
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition"
          onClick={handleClearLines}
        >
          Clear
        </button>
      </div>
      
      <div className="mx-4">
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default ChartComponent;
