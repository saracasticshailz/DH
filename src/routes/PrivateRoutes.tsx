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
const MortgageDashboard = lazy(() => import('@/views/Dashboard/MortgageDashboard/MortgageDashboard'));

const PRIVATE_ROUTES = [
  {
    children: [
      {
        path: '*',
        element: <NotFoundView />,
      },
      {
        path: '/',
        element: <SignupScreen />,
      },
      {
        path: '/Login',
        element: <LoginScreen />,
      },
      // {
      //   path: 'auth/*',
      //   element: <Navigate to="/" replace />,
      // },
      // {
      //   path: '/me',
      //   element: <NotImplementedView />,
      // },
      {
        path: '/PropertyValuation',
        element: <PropertyValuation />,
      },
      {
        path: '/Dashboard',
        element: <MortgageDashboard />,
      },
      {
        path: '/PreApprovalPage',
        element: <PreApprovalPage />,
      },
    ],
  },
];

export default PRIVATE_ROUTES;
