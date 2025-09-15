import AppRoutes from './router';
import ThemeProvider from './components/ThemeProvider';
import { AriaProvider } from './context/AriaContext';

function App() {
  return (
    <ThemeProvider>
      <AriaProvider>
        <AppRoutes />
      </AriaProvider>
    </ThemeProvider>
  );
}

export default App;
