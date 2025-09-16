import AppRoutes from './router';
import ThemeProvider from './components/ThemeProvider';
import { AriaProvider } from './context/AriaContext';
import { SupabaseProvider } from './context/SupabaseContext';

function App() {
  console.log('🚀 App component loaded - version 2.0')
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
