import { Navigate } from 'react-router-dom';
import { NotFoundView } from '@/views';
import { lazy } from 'react';
import SignupScreen from '@/views/Auth/SignUp/SignupScreen';
import LoginScreen from '@/views/Auth/Login';
import PreApprovalPage from '@/views/Dashboard/Preapproval/PreApprovalPage';
import PropertyValuation from '@/views/Dashboard/PropertyValuation';
import RmLoginScreen from '@/views/Auth/RM/RmLogin';
import { useAppSelector } from '@/hooks/redux';
import { selectAuth } from '@/store/slices/CustomerAuthSlice';
import PaymentLanding from '@/views/Dashboard/PropertyValuation/PaymentForm/PaymentLanding';

const MortgageDashboard = lazy(() => import('@/views/Dashboard/MortgageDashboard/MortgageDashboard'));
const RmDashboard = lazy(() => import('@/views/RM/RmDashboard'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Replace this with your actual authentication check
  // const isAuthenticated = localStorage.getItem('token'); // or your auth check method
  const { isAuthenticated } = useAppSelector(selectAuth);

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  return <>{children}</>;
};

const PRIVATE_ROUTES = [
  {
    children: [
      // Public routes
      {
        path: '/',
        element: <SignupScreen />,
      },
      {
        path: '/Login',
        element: <LoginScreen />,
      },

      // Protected routes
      {
        path: '/PropertyValuation',
        element: (
          // <ProtectedRoute>
          <PropertyValuation />
          // </ProtectedRoute>
        ),
      },
      {
        path: '/Dashboard',
        element: (
          // <ProtectedRoute>
          <MortgageDashboard />
          // </ProtectedRoute>
        ),
      },
      {
        path: '/PreApprovalPage',
        element: (
          // <ProtectedRoute>
          <PreApprovalPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: '/RmDashboard',
        element: (
          // <ProtectedRoute>
          <RmDashboard />
          // </ProtectedRoute>
        ),
      },

      {
        path: '*',
        element: <NotFoundView />,
      },
      {
        path: './RmLogin',
        element: <RmLoginScreen />,
      },
      {
        path: '/PaymentLanding',
        element: <PaymentLanding />,
      },
    ],
  },
];

export default PRIVATE_ROUTES;
