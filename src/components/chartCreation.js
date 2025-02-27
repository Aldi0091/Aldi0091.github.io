// chartCreation.js
import { createChart } from 'lightweight-charts';

/**
 * Функция для создания графика с заданными настройками.
 *
 * @param {HTMLElement} container - DOM-элемент, в котором будет создан график.
 * @returns {Chart} - Созданный объект графика.
 */
export function createConfiguredChart(container) {
  // Создаем график с указанными размерами
  const chart = createChart(container, {
    width: container.clientWidth,
    height: 700,
  });

  // Применяем настройки временной шкалы
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
      },
    },
  });
  chart.timeScale().fitContent();

  return chart;
}
