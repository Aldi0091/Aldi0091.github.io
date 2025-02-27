export function handleDrawShort({
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
      const diff = 19;      // Разница для нижней линии
      const ratio = 0.2;    // Коэффициент для средней линии
      const subDelta = 10;  // Смещение для subbottom линии
  
      // Рассчитываем цены для линий
      const benchmarkPrice = clickPrice; // Верхняя линия (бенчмарк)
      const newMiddlePrice = benchmarkPrice + diff; // Нижняя линия
      const newBottomPrice = newMiddlePrice - ratio * (newMiddlePrice - benchmarkPrice); // Средняя линия
  
      // Вычисляем позицию для subbottom линии как фиксированное смещение от нижней линии
      let computedSubBottomPrice = newMiddlePrice + subDelta;

  
      topLineRef.current = chart.addLineTool(
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
      middleLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: newMiddlePrice }],
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
            "color": "#00FF00",
            "width": 1,
            "style": 0,
          },
        }
      );
      subBottomLineRef.current = chart.addLineTool(
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
  
      // Сохраняем начальные значения для дальнейшего смещения при перетаскивании верхней линии
      initialTopPriceRef.current = computedSubBottomPrice;
      initialSubBottomPriceRef.current = benchmarkPrice;
  
      chart.unsubscribeClick(clickHandler);
      setBenchmarkDrawn(true);
    };
  
    chartRef.current.subscribeClick(clickHandler);
  }
  