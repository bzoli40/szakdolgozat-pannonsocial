import React from 'react';
import logo from './logo.svg';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import MainLayout from './layouts/mainLayout';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import FireBase from './components/FireBase';
import ToastSystem from './components/ToastSystem';

function App() {

  const { darkMode } = useSelector((state: any) => state.darkMode);
  const routing = useRoutes(routes());

  return (
    <div className="App" data-theme={darkMode ? 'dark' : 'light'}>
      <FireBase />
      <ToastSystem />
      {routing}
    </div>
  );
}

export default App;
