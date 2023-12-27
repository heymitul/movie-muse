import React from 'react';
import './index.css';

import { createRoot } from 'react-dom/client';

import App from './App';
import 'react-toastify/dist/ReactToastify.css';

const container = document.querySelector('#root');
const root = createRoot(container);

root.render(
    <App/>
);
