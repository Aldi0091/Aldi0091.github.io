import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export const ChartComponent = (props) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const selectedToolRef = useRef(null); // Store the selected trendline

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 1) Create the chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'white' },
                textColor: 'black',
            },
            width: chartContainerRef.current.clientWidth,
            height: 700,
        });

        chartRef.current = chart;

        // 2) Add candlestick series
        const candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(props.data);

        // 3) Detect when a trendline is selected (double-click or after edit)
        chart.subscribeLineToolsDoubleClick((event) => {
            if (event.selectedLineTool) {
                console.log("Trendline selected (double-click):", event.selectedLineTool);
                selectedToolRef.current = event.selectedLineTool;
            }
        });

        chart.subscribeLineToolsAfterEdit((event) => {
            if (event.selectedLineTool) {
                console.log("Trendline selected (after edit):", event.selectedLineTool);
                selectedToolRef.current = event.selectedLineTool;
            }
        });

        // 4) Attach right-click event listener to the chart container
        const handleContextMenuEvent = (event) => handleContextMenu(event);
        chartContainerRef.current.addEventListener('contextmenu', handleContextMenuEvent);

        // 5) Attach global click event listener to close the menu
        const handleClickOutside = () => closeContextMenu();
        document.addEventListener('click', handleClickOutside);

        // 6) Cleanup on unmount
        return () => {
            chart.remove();
            if (chartContainerRef.current) {
                chartContainerRef.current.removeEventListener('contextmenu', handleContextMenuEvent);
            }
            document.removeEventListener('click', handleClickOutside);
        };
    }, [props.data]);

    // Function to activate trend line drawing mode
    const handleDrawTrendLine = () => {
        if (!chartRef.current) return;
        chartRef.current.setActiveLineTool('TrendLine', {
            color: 'red',
            lineWidth: 2,
        });
    };

    const handleClearLines = () => {
        if (!chartRef.current) return;
        chartRef.current.removeAllLineTools();
        console.log("All trendlines removed.");
    };

    // Function to handle right-click (context menu) on a selected trendline
    const handleContextMenu = (event) => {
        event.preventDefault();
        
        if (!selectedToolRef.current) {
            console.log("No trendline selected for right-click.");
            return;
        }

        console.log("Right-clicked on trendline:", selectedToolRef.current);
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
        });
    };

    // Function to close the context menu
    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0 });
    };

    return (
        <div className="w-full bg-gray-800 rounded-lg shadow-lg relative">
            <div className="mx-4 bg-gray-800 rounded-lg shadow-lg relative">
                <h1 className="text-2xl font-bold text-white mb-2">PoC Trading Chart</h1>
                <p className="text-gray-300 mb-6">
                    Draw a line & right-click to options
                </p>
                <button 
                    className="mb-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
                    onClick={handleDrawTrendLine}
                >
                    Draw Trend Line
                </button>
                <button 
                    className="mx-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition"
                    onClick={handleClearLines}
                >
                    Clear
                </button>
            </div>
            
            {/* Chart Container */}
            <div ref={chartContainerRef} style={{ width: '100%', height: 700 }} />

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    style={{
                        position: 'absolute',
                        top: contextMenu.y - 75,
                        left: contextMenu.x - 25,
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        padding: '8px',
                    }}
                >
                    <button 
                        onClick={closeContextMenu} 
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                        Set BOS
                    </button>
                    <button 
                        onClick={closeContextMenu} 
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                        Set Target Price
                    </button>
                </div>
            )}
        </div>
    );
};

// Function to generate sample candlestick data
function generateCandlestickData(startDate, days) {
    const data = [];
    let currentDate = new Date(startDate);
    let open = 100;

    for (let i = 0; i < days; i++) {
        const high = open + Math.random() * 10;
        const low = open - Math.random() * 10;
        const close = low + Math.random() * (high - low);

        data.push({
            time: currentDate.toISOString().split('T')[0],
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
        });

        open = close + (Math.random() - 0.5) * 5;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
}

// Initialize sample data
const initialData = generateCandlestickData('2024-01-01', 365);

// Main application component
export default function App(props) {
    return (
        <div className="width-auto min-h-screen flex items-center justify-center bg-gray-800">
            <ChartComponent data={initialData} />
        </div>
    );
}
