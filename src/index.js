import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CustomProvider } from './context/context';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CustomProvider >
    <App />
    <Toaster/>
    </CustomProvider>
  
);


reportWebVitals();
