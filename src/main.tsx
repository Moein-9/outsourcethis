
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import NotFound from './pages/NotFound.tsx';
import ReportPage from './pages/ReportPage.tsx';
import PrintLabelPage from './pages/PrintLabelPage.tsx';
import SystemPage from './pages/SystemPage.tsx';
import Index from './pages/Index.tsx';
import { CustomWorkOrderReceipt } from './components/CustomWorkOrderReceipt.tsx';
import { LensDebugger } from './components/LensDebugger.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "reports",
        element: <ReportPage />
      },
      {
        path: "print-label/:frameId",
        element: <PrintLabelPage />
      },
      {
        path: "system",
        element: <SystemPage />
      },
      {
        path: "custom-work-order",
        element: <CustomWorkOrderReceipt workOrder={{}} />
      },
      {
        path: "lens-debug",
        element: <LensDebugger />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
