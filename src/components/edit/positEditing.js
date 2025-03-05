//
export function updatePositions(
    params,
    chart,
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
  ) {

    if (!topLineRef.current) {
      topLineRef.current = params.selectedLineTool;
      return;
    }
  
    if (params.selectedLineTool.id === topLineRef.current.Og.ji) {
      newHighTop.current = params.selectedLineTool.points[0].price;
      settopHigh(newHighTop.current);
      const newEntryPrice = currLow.current + ratio * (newHighTop.current - currLow.current);
      const stopLossPrice = newEntryPrice - ((newHighTop.current - newEntryPrice) / 2);
      setEntryPrice(newEntryPrice);
      setStopLoss(stopLossPrice);

      chart.removeLineToolsById([topLineRef.current ? topLineRef.current.Og.ji : '']);
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

      chart.removeLineToolsById([bottomLineRef.current ? bottomLineRef.current.Og.ji : '']);
      bottomLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: currLow.current }],
        {
          "line": {
            "color": "#2962FF",
            "width": 1,
            "style": 0,
          },
        }
      );

      chart.removeLineToolsById([middleLineRef.current ? middleLineRef.current.Og.ji : '']);
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

      chart.removeLineToolsById([subBottomLineRef.current ? subBottomLineRef.current.Og.ji : '']);
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
    } else if (params.selectedLineTool.id === bottomLineRef.current.Og.ji) {
      const currentLow = params.selectedLineTool.points[0].price;
      
      currLow.current = currentLow;
      const newEntryPrice = currLow.current + ratio * (newHighTop.current - currLow.current);
      const stopLossPrice = newEntryPrice - ((newHighTop.current - newEntryPrice) / 2);
      setEntryPrice(newEntryPrice);
      setStopLoss(stopLossPrice);

      chart.removeLineToolsById([topLineRef.current ? topLineRef.current.Og.ji : '']);
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

      chart.removeLineToolsById([bottomLineRef.current ? bottomLineRef.current.Og.ji : '']);
      bottomLineRef.current = chart.addLineTool(
        "HorizontalLine",
        [{ price: currLow.current }],
        {
          "line": {
            "color": "#2962FF",
            "width": 1,
            "style": 0,
          },
        }
      );

      chart.removeLineToolsById([middleLineRef.current ? middleLineRef.current.Og.ji : '']);
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

      chart.removeLineToolsById([subBottomLineRef.current ? subBottomLineRef.current.Og.ji : '']);
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
      
    }
  }
  