import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ThemeProvider } from './components/theme-provider';
import { TENANT_DEFAULT_THEME_COLOR } from './config/tenant';
import { ErrorBoundary } from './components/ErrorBoundary';
import ErrorPage from './components/ErrorPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ErrorBoundary fallback={<ErrorPage />}>
      <ThemeProvider
        defaultTheme='dark'
        defaultColor={TENANT_DEFAULT_THEME_COLOR}
        defaultOpacity={1.0}
        defaultBorderRadius='md'
      >
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
);
