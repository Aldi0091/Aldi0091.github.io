import { ChartComponent } from './components/ChartComponent';
import initialData from './initialData.json';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';


export default function App(props) {
  return (
    <div className="width-auto min-h-screen flex items-center justify-center bg-gray-800">
      <ChartComponent data={initialData} />
      <Notifications position="top-right" />
    </div>
  );
}
