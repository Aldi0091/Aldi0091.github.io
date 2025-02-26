import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { generateCandlestickData } from './utils/dataGenerator';
import { CheckIcon } from '@radix-ui/react-icons';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';


export const ChartComponent = (props) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const selectedToolRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'white' },
                textColor: 'black',
            },
            width: chartContainerRef.current.clientWidth,
            height: 700,
        });

        chartRef.current = chart;

        const candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(props.data);

        chart.subscribeLineToolsDoubleClick((event) => {
            if (event.selectedLineTool) {
                selectedToolRef.current = event.selectedLineTool;
            }
        });

        chart.subscribeLineToolsAfterEdit((event) => {
            if (event.selectedLineTool) {
                selectedToolRef.current = event.selectedLineTool;
            }
        });

        const handleContextMenuEvent = (event) => handleContextMenu(event);
        chartContainerRef.current.addEventListener('contextmenu', handleContextMenuEvent);

        const handleClickOutside = () => closeContextMenu();
        document.addEventListener('click', handleClickOutside);

        return () => {
            chart.remove();
            if (chartContainerRef.current) {
                chartContainerRef.current.removeEventListener('contextmenu', handleContextMenuEvent);
            }
            document.removeEventListener('click', handleClickOutside);
        };
    }, [props.data]);

    const handleDrawHorizontalLine = () => {
        if (!chartRef.current) return;
        chartRef.current.setActiveLineTool('HorizontalLine', {
            color: 'red',
            lineWidth: 2,
        });
    };

    const handleClearLines = () => {
        if (!chartRef.current) return;
        chartRef.current.removeAllLineTools();
        selectedToolRef.current = null;
    };

    const handleContextMenu = (event) => {
        event.preventDefault();
        if (!chartRef.current || !selectedToolRef.current) {
            return;
        }
    
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
        });  
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0 });
    };

    const handleSetContextButtonClick = (event, kind) => {
        event.preventDefault();
        if (!selectedToolRef.current || !chartRef.current) return;
        const lineToolData = JSON.parse(chartRef.current.getSelectedLineTools())[0];
        if (!lineToolData) {
            console.error("No selected line tool found.");
            return;
        }
        const price = lineToolData.points[0].price;
        lineToolData.options.line.color = kind;
        notifications.show({
            title: 'Line Updated',
            message: `Line set at price: ${price.toFixed(2)}`,
            color: 'green',
            icon: <CheckIcon size={16} />,
            autoClose: 5000,
          });
        chartRef.current.applyLineToolOptions(lineToolData);

        closeContextMenu();
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
                    onClick={handleDrawHorizontalLine}
                >
                    Draw Horizontal Line
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
                        onClick={(event, kind) => handleSetContextButtonClick(event, kind='#008000')}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                        Set BOS
                    </button>
                    <button 
                        onClick={(event, kind) => handleSetContextButtonClick(event, kind='#FF0000')}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                        Set Target Price
                    </button>
                </div>
            )}
        </div>
    );
};

const initialData = generateCandlestickData('2024-01-01', 365);

export default function App(props) {
    return (
            <div className="width-auto min-h-screen flex items-center justify-center bg-gray-800">
                <ChartComponent data={initialData} />
                <Notifications position="top-right" />
            </div>
    );
}
