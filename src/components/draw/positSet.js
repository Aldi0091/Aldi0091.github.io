//
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { notifications } from '@mantine/notifications';

export function handleDrawPosition({
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
  }) {
    if (!chartRef.current) return;

    chartRef.current.setActiveLineTool('HorizontalLine', {
      color: 'red',
      lineWidth: 2,
    });
  
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
  
    const clickHandler = (params) => {
      chart.removeAllLineTools();
      newHighTop.current = candleSeries.coordinateToPrice(params.point.y);
      currLow.current = currentPrice;
      
      if (newHighTop.current > currentPrice && position === 'long' || newHighTop.current < currentPrice && position === 'short') {
        const newEntryPrice = currentPrice + ratio * (newHighTop.current - currentPrice);
        const stopLossPrice = newEntryPrice - ((newHighTop.current - newEntryPrice) / 2)
        setEntryPrice(newEntryPrice);
        setStopLoss(stopLossPrice);
        settopHigh(newHighTop.current)
        topLineRef.current = chart.addLineTool(
          "HorizontalLine",
          [{ price: newHighTop.current }],
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
          [{ price: currentPrice }],
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
          [{ price: newEntryPrice }],
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
          [{ price: stopLossPrice }],
          {
            "line": {
              "color": "#FF0000",
              "width": 1,
              "style": 0,
            },
          }
        );
      } else {
        notifications.show({
          title: `Warning: ${position.toUpperCase()} Position Alert`,
          message: `Place Target Price ${position === 'long' ? 'over' : 'below'} Current Low`,
          color: 'yellow',
          icon: <ExclamationTriangleIcon size={16} />,
          autoClose: 5000,
        });        
      }

      chart.unsubscribeClick(clickHandler);
    };
  
    chartRef.current.subscribeClick(clickHandler);
  }
  