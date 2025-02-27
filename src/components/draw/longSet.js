// lineDrawing.js

/**
 * Функция, которая устанавливает обработчик клика для рисования линий.
 * При клике рассчитываются и добавляются линии: верхняя (benchmark), нижняя, средняя и subbottom.
 *
 * Параметры:
 *  - chartRef: ссылка на объект графика.
 *  - candleSeriesRef: ссылка на серию свечного графика.
 *  - topLineRef, bottomLineRef, middleLineRef, subBottomLineRef: ссылки на линии.
 *  - initialTopPriceRef, initialSubBottomPriceRef: ссылки для хранения начальных значений верхней и subbottom линий.
 *  - setBenchmarkDrawn: функция для обновления состояния, что бенчмарк нарисован.
 */
export function handleDrawLong({
    chartRef,
    candleSeriesRef,
    topLineRef,
    bottomLineRef,
    middleLineRef,
    subBottomLineRef,
    initialTopPriceRef,
    initialSubBottomPriceRef,
    setBenchmarkDrawn,
  }) {
    if (!chartRef.current) return;
  
    // Активируем инструмент рисования горизонтальной линии (цвет инструмента не влияет на итоговые линии)
    chartRef.current.setActiveLineTool('HorizontalLine', {
      color: 'red',
      lineWidth: 2,
    });
  
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
  
    // Обработчик клика по графику
    const clickHandler = (params) => {
      chart.removeAllLineTools();
  
      // Получаем цену по вертикальной координате клика
      const clickPrice = candleSeries.coordinateToPrice(params.point.y);
  
      // Параметры для расчета линий
      const diff = 25;      // Разница для нижней линии
      const ratio = 0.2;    // Коэффициент для средней линии
      const subDelta = 10;  // Смещение для subbottom линии
  
      // Рассчитываем цены для линий
      const benchmarkPrice = clickPrice; // Верхняя линия (бенчмарк)
      const newBottomPrice = benchmarkPrice - diff; // Нижняя линия
      const newMiddlePrice = newBottomPrice + ratio * (benchmarkPrice - newBottomPrice); // Средняя линия
  
      // Вычисляем позицию для subbottom линии как фиксированное смещение от нижней линии
      let computedSubBottomPrice = newBottomPrice - subDelta;
      if (computedSubBottomPrice > newBottomPrice) {
        computedSubBottomPrice = newBottomPrice - 0.1;
      }
  
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
            "color": "#00FF00",
            "width": 1,
            "style": 0,
          },
        }
      );
  
      subBottomLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: computedSubBottomPrice }],
        {
          "line": {
            "color": "#FF0000",
            "width": 1,
            "style": 0,
          },
        }
      );
  
      // Сохраняем начальные значения для дальнейшего смещения при перетаскивании верхней линии
      initialTopPriceRef.current = benchmarkPrice;
      initialSubBottomPriceRef.current = computedSubBottomPrice;
  
      chart.unsubscribeClick(clickHandler);
      setBenchmarkDrawn(true);
    };
  
    chartRef.current.subscribeClick(clickHandler);
  }
  