import React from 'react';
import ReactDOM from 'react-dom/client';
import Scene from './Scene';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Scene />
  </React.StrictMode>
);

