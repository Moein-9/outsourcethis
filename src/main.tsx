
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import NotFound from './pages/NotFound.tsx';
import ReportPage from './pages/ReportPage.tsx';
import PrintLabelPage from './pages/PrintLabelPage.tsx';
import SystemPage from './pages/SystemPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />
  },
  {
    path: "/reports",
    element: <ReportPage />
  },
  {
    path: "/print-label/:frameId",
    element: <PrintLabelPage />
  },
  {
    path: "/system",
    element: <SystemPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
