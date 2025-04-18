import { useCallback, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppLoading } from '@/components';
import PRIVATE_ROUTES from './PrivateRoutes';
import PUBLIC_ROUTES from './PublicRoutes';
import { useAuthWatchdog, useIsAuthenticated } from '@/hooks';

const routesPrivate = createBrowserRouter(PRIVATE_ROUTES);
const routesPublic = createBrowserRouter(PUBLIC_ROUTES);

/**
 * Renders routes depending on Authenticated or Anonymous users
 * @component Routes
 */
const Routes = () => {
  const [loading, setLoading] = useState(false); // True until the AuthWatchdog tells us if user is authenticated or not
  const [refreshCount, setRefreshCount] = useState(0);
  const isAuthenticated = useIsAuthenticated();

  const afterLogin = useCallback(() => {
    setRefreshCount((old) => old + 1); // Force re-render
    setLoading(false);
  }, []);

  const afterLogout = useCallback(() => {
    setRefreshCount((old) => old + 1); // Force re-render
    setLoading(false);
  }, []);

  // Create Auth watchdog, that calls our callbacks wen user is logged in or logged out
  useAuthWatchdog(afterLogin, afterLogout);

  if (loading) {
    return <AppLoading />; // Show loading spinner until we know if user is authenticated or not
  }

  // IS_DEBUG && console.log('Re-render <Routes/>', { isAuthenticated, refresh: refreshCount });
  const routes = createBrowserRouter([...PRIVATE_ROUTES]);
  //isAuthenticated ? routesPrivate : routesPublic
  return <RouterProvider router={routes} />;
};
export default Routes;
