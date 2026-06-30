import { createBrowserRouter } from 'react-router';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './protected-route';

// Lazy loaded components
const LandingPage = lazy(() => import('../features/home/components/landing-page').catch(() => ({ default: () => <div>Loading...</div> })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/menu',
    element: <div>Menu Page (TODO)</div>,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <div>Profile Page (TODO)</div>
      </ProtectedRoute>
    ),
  },
]);
