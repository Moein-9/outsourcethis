
/// <reference types="vite/client" />

import * as ReactDOMServer from 'react-dom/server';

declare global {
  interface Window {
    ReactDOMServer: typeof ReactDOMServer;
  }
}
