import { Navigate } from 'react-router-dom';
import { IS_DEBUG } from '@/config';
import { NotFoundView } from '@/views';
import WelcomeView from '@/views/Welcome';
import NotImplementedView from '@/views/NotImplementedView';
import { lazy } from 'react';
import SignupScreen from '@/views/Auth/SignUp/SignupScreen';
import LoginScreen from '@/views/Auth/Login';
import LoanDetails from '@/views/Dashboard/Preapproval/LoanDetails';
import PreApprovalPage from '@/views/Dashboard/Preapproval/PreApprovalPage';
import PropertyDetailsForm from '@/views/Dashboard/PropertyValuation/PropertyDetailsForm';
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
        element: <PreApprovalPage />,
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

      // Catch all route should be last
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
