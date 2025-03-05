// chartCreation.js
import { createChart, ColorType } from 'lightweight-charts';

/**
 * Функция для создания графика с заданными настройками.
 *
 * @param {HTMLElement} container - DOM-элемент, в котором будет создан график.
 * @returns {Chart} - Созданный объект графика.
 */
export function createConfiguredChart(container) {
  const chart = createChart(container, {
    layout: {
      background: { type: ColorType.Solid, color: 'black' },
      textColor: 'white',
    },
    grid: {
      vertLines: { color: 'rgba(255,255,255,0.1)' },
      horzLines: { color: 'rgba(255,255,255,0.1)' },
    },
    width: container.clientWidth,
    height: 700,
  });

  chart.applyOptions({
    timeScale: {
      rightOffset: 0,
      barSpacing: 5,
      fixLeftEdge: false,
      fixRightEdge: false,
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
