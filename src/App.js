import { ChartComponent } from './ChartComponent';
import { generateCandlestickData } from './utils/dataGenerator';
import { generateMinutelyCandlestickData } from './utils/dataCandles';
import initialData from './initialData.json';

// const initialData = generateMinutelyCandlestickData();;

export default function App(props) {
  return (
    <div className="width-auto min-h-screen flex items-center justify-center bg-gray-800">
      <ChartComponent data={initialData} />
    </div>
  );
}
