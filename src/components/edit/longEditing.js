/**
 * Функция обновления позиций линий при редактировании.
 *
 * @param {Object} params - Параметры события редактирования линии.
 * @param {Object} chart - Объект графика.
 * @param {Object} topLineRef - Ссылка на верхнюю линию.
 * @param {Object} bottomLineRef - Ссылка на нижнюю линию.
 * @param {Object} middleLineRef - Ссылка на среднюю линию.
 * @param {Object} subBottomLineRef - Ссылка на subbottom линию.
 * @param {Object} initialTopPriceRef - Ссылка на начальное значение верхней линии.
 * @param {Object} initialSubBottomPriceRef - Ссылка на начальное значение subbottom линии.
 * @param {Object} subDeltaRef - Ссылка для хранения смещения subbottom линии.
 */
export function updateLongPositions(
    params,
    chart,
    topLineRef,
    bottomLineRef,
    middleLineRef,
    subBottomLineRef,
    initialTopPriceRef,
    initialSubBottomPriceRef,
    subDeltaRef
  ) {
    // Если верхняя линия ещё не установлена, сохраняем её и выходим
    if (!topLineRef.current) {
      topLineRef.current = params.selectedLineTool;
      return;
    }
  
    if (params.selectedLineTool.id === topLineRef.current.Og.ji) {
      // Редактируется верхняя линия
      const newTopPrice = params.selectedLineTool.points[0].price;
      const fixedBottomPrice = bottomLineRef.current.Og.Ls[0].price;
      const ratio = 0.2;
      // Вычисляем новую позицию для средней линии
      const newMiddlePrice = fixedBottomPrice + ratio * (newTopPrice - fixedBottomPrice);
  
      // Обновляем среднюю линию
      chart.removeLineToolsById([middleLineRef.current ? middleLineRef.current.Og.ji : '']);
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
  
      // Вычисляем дельту изменения верхней линии от исходного значения
      let delta = newTopPrice - initialTopPriceRef.current;
      // Смещаем subbottom линию на ту же дельту относительно её исходного значения
      let newSubBottomPrice = initialSubBottomPriceRef.current + delta;
      // Если subbottom поднимается выше нижней линии, корректируем значение
      if (newSubBottomPrice > fixedBottomPrice) {
        newSubBottomPrice = fixedBottomPrice - 0.1;
      }
      // Обновляем subDelta (для дальнейших вычислений при редактировании нижней линии)
      subDeltaRef.current = fixedBottomPrice - newSubBottomPrice;
  
      chart.removeLineToolsById([subBottomLineRef.current ? subBottomLineRef.current.Og.ji : '']);
      subBottomLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: newSubBottomPrice }],
        {
          "line": {
            "color": "#FF0000",
            "width": 1,
            "style": 0,
          },
        }
      );
    } else if (params.selectedLineTool.id === bottomLineRef.current.Og.ji) {
      // Редактируется нижняя линия – обновляем subbottom с использованием сохранённого subDelta
      const newBottomPrice = params.selectedLineTool.points[0].price;
      const newSubBottomPrice = newBottomPrice - subDeltaRef.current;
      chart.removeLineToolsById([subBottomLineRef.current ? subBottomLineRef.current.Og.ji : '']);
      subBottomLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: newSubBottomPrice }],
        {
          "line": {
            "color": "#FF0000",
            "width": 1,
            "style": 0,
          },
        }
      );
    }
  }
  