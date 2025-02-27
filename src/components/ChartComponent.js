import React, { useEffect, useRef, useState } from 'react';
import { handleDrawLong } from './draw/longSet';
import { handleDrawShort } from './draw/shortSet';
import { updateLongPositions } from './edit/longEditing';
import { updateShortPositions } from './edit/shortEditing'; // новый обработчик для short setup
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
  // Режим: "long" или "short"
  const [setupMode, setSetupMode] = useState(null);
  // Ссылка на текущий обработчик подписки
  const subscriptionRef = useRef(null);

  // Создаем график один раз
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createConfiguredChart(chartContainerRef.current);
    chartRef.current = chart;
    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(props.data);
    candleSeriesRef.current = candleSeries;

    return () => {
      if (subscriptionRef.current) {
        chart.unsubscribeLineToolsAfterEdit(subscriptionRef.current);
      }
      chart.remove();
    };
  }, [props.data]);

  // При смене режима обновляем подписку на обработчик редактирования линий
  useEffect(() => {
    if (!chartRef.current) return;
    // Отписываем предыдущий обработчик, если он был
    if (subscriptionRef.current) {
      chartRef.current.unsubscribeLineToolsAfterEdit(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    // Если режим не выбран, выходим
    if (!setupMode) return;

    // Выбираем обработчик в зависимости от режима
    if (setupMode === 'long') {
      subscriptionRef.current = (params) =>
        updateLongPositions(
          params,
          chartRef.current,
          topLineRef,
          bottomLineRef,
          middleLineRef,
          subBottomLineRef,
          initialTopPriceRef,
          initialSubBottomPriceRef,
          subDeltaRef
        );
    } else if (setupMode === 'short') {
      subscriptionRef.current = (params) =>
        updateShortPositions(
          params,
          chartRef.current,
          topLineRef,
          bottomLineRef,
          middleLineRef,
          subBottomLineRef,
          initialTopPriceRef,
          initialSubBottomPriceRef,
          subDeltaRef
        );
    }
    // Подписываемся на событие с выбранным обработчиком
    if (subscriptionRef.current) {
      chartRef.current.subscribeLineToolsAfterEdit(subscriptionRef.current);
    }
  }, [setupMode]);

  const onDrawLong = () => {
    // Перед началом отрисовки очищаем линии и отписываем предыдущий обработчик
    if (chartRef.current) {
      chartRef.current.removeAllLineTools();
      if (subscriptionRef.current) {
        chartRef.current.unsubscribeLineToolsAfterEdit(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    }
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
    setSetupMode('long');
  };

  const onDrawShort = () => {
    if (chartRef.current) {
      chartRef.current.removeAllLineTools();
      if (subscriptionRef.current) {
        chartRef.current.unsubscribeLineToolsAfterEdit(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    }
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
    setSetupMode('short');
  };

  const handleClearLines = () => {
    if (!chartRef.current) return;
    chartRef.current.removeAllLineTools();
    // Сбрасываем режим и отписываем обработчик
    if (subscriptionRef.current) {
      chartRef.current.unsubscribeLineToolsAfterEdit(subscriptionRef.current);
      subscriptionRef.current = null;
    }
    setSetupMode(null);
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-lg relative">
      <div className="mx-4 bg-gray-800 rounded-lg shadow-lg relative">
        <h1 className="text-2xl font-bold text-white mb-2">PoC Trading Chart</h1>
        <p className="text-gray-300 mb-6">
          Click the button then click on the chart to draw benchmark lines.
        </p>
        <button 
          className="mb-4 px-4 py-2 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-900 transition"
          onClick={onDrawLong}
        >
          Long
        </button>
        <button 
          className="mb-4 mx-2 px-4 py-2 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-900 transition"
          onClick={onDrawShort}
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
      
      <div className="mx-4">
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default ChartComponent;
