import { Navigate } from 'react-router-dom';
import AuthView from '@/views/Auth';
import SignupScreen from '@/views/Auth/SignUp/SignupScreen';

const PUBLIC_ROUTES = [
  {
    // element: <PublicLayout />, // Layout as parent/wrapper component for all routes
    children: [
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
      {
        path: '/',
        element: <SignupScreen />,
      },

      {
        path: '/auth',
        element: <AuthView />,
      },
    ],
  },
];

export default PUBLIC_ROUTES;
