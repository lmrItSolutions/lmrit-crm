import AppRoutes from './router';
import ThemeProvider from './components/ThemeProvider';
import { AriaProvider } from './context/AriaContext';
import { SupabaseProvider } from './context/SupabaseContext';

function App() {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <AriaProvider>
          <AppRoutes />
        </AriaProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}

export default App;
