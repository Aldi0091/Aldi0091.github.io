import React, { useEffect, useRef, useState } from 'react';
import { handleDrawPosition } from './draw/positSet';
import { updatePositions } from './edit/positEditing';
import { createConfiguredChart } from './chartCreation';

export const ChartComponent = (props) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const middleLineRef = useRef(null);
  const subBottomLineRef = useRef(null);
  const [topHigh, settopHigh] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [stopLoss, setStopLoss] = useState(0);
  const newHighTop = useRef(null);
  const currLow = useRef(null);
  const [setupMode, setSetupMode] = useState(null);
  const subscriptionRef = useRef(null);
  const ratio = 0.2;

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createConfiguredChart(chartContainerRef.current);
    chartRef.current = chart;
    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(props.data);
    candleSeriesRef.current = candleSeries;

    const lastCandle = props.data[props.data.length - 1];

    if (lastCandle) {
      setCurrentPrice(lastCandle.close);
    }
    return () => {
      if (subscriptionRef.current) {
        chart.unsubscribeLineToolsAfterEdit(subscriptionRef.current);
      }
      chart.remove();
    };
  }, [props.data, currentPrice]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (subscriptionRef.current) {
      chartRef.current.unsubscribeLineToolsAfterEdit(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    if (!setupMode) return;

    currLow.current = currentPrice;

    subscriptionRef.current = (params) =>
      updatePositions(
        params,
        chartRef.current,
        topLineRef,
        bottomLineRef,
        middleLineRef,
        subBottomLineRef,
        ratio,
        newHighTop,
        currLow,
        settopHigh,
        setEntryPrice,
        setStopLoss
      );
    
    if (subscriptionRef.current) {
      chartRef.current.subscribeLineToolsAfterEdit(subscriptionRef.current);
    }
  }, [setupMode]);

  const onDrawPosition = (position) => {
    if (chartRef.current) {
      chartRef.current.removeAllLineTools();
      if (subscriptionRef.current) {
        chartRef.current.unsubscribeLineToolsAfterEdit(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    }
    handleDrawPosition({
        chartRef,
        candleSeriesRef,
        topLineRef,
        bottomLineRef,
        middleLineRef,
        subBottomLineRef,
        currentPrice,
        ratio,
        newHighTop,
        currLow,
        position,
        settopHigh,
        setEntryPrice,
        setStopLoss
      });
    
    setSetupMode('null');
  };

  
  const handleClearLines = () => {
    settopHigh(0);
    setEntryPrice(0);
    setStopLoss(0);
    currLow.current = 0;
    if (!chartRef.current) return;
    chartRef.current.removeAllLineTools();

    if (subscriptionRef.current) {
      chartRef.current.unsubscribeLineToolsAfterEdit(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    setSetupMode(null);
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-lg relative">
      <div className="mx-4 bg-gray-800 rounded-lg shadow-lg relative">
        <h1 className="text-2xl font-bold text-white mb-2">Trading Chart</h1>
        <p className="text-gray-300">
          Click & set long and short positions, customize the profit.
        </p>
        <p  className="text-gray-300 mb-6">
          <span className="text-yellow-300">Warning</span>: if lines are not drawn properly, keep clicking `Clear` until normal lines appear.
        </p>
        <div className="flex justify-between items-center mb-4 p-1">
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-900 transition"
              onClick={() => onDrawPosition('long')}
            >
              Long
            </button>
            <button 
              className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-900 transition"
              onClick={() => onDrawPosition('short')}
            >
              Short
            </button>
            <button 
              className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-900 transition"
              onClick={handleClearLines}
            >
              Clear
            </button>
          </div>
          <div className="flex space-x-2">
            <div className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-inner">
              <p className="text-xs text-gray-400 ">Target Price</p>
              <p className="text-xs text-gray-100 mt-1">$ {topHigh !== null ? topHigh.toFixed(2) : 'N/A'}</p>
            </div>
            <div className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-inner">
              <p className="text-xs text-gray-400 ">Entry Price</p>
              <p className="text-xs text-gray-100 mt-1">$ {entryPrice !== null ? entryPrice.toFixed(2) : 'N/A'}</p>
            </div>
            <div className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-inner">
              <p className="text-xs text-gray-400 ">Current Low</p>
              <p className="text-xs text-gray-100 mt-1">
                $ {currLow.current != null 
                    ? currLow.current.toFixed(2) 
                    : currentPrice !== null 
                        ? currentPrice.toFixed(2) 
                        : 'N/A'}
              </p>
            </div>
            <div className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-inner">
              <p className="text-xs text-gray-400 ">Stop Loss</p>
              <p className="text-xs text-gray-100 mt-1">$ {stopLoss !== null ? stopLoss.toFixed(2) : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mx-4">
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default ChartComponent;
