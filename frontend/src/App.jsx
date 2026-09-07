import { useState } from 'react';
import './App.css'
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
  const [currentView, setCurrentView] = useState('login');

  const toggleView = () => {
    setCurrentView(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <>
      {currentView === 'login' ? (
        <LoginPage onSwitchView={toggleView} />
      ) : (
        <RegisterPage onSwitchView={toggleView} />
      )}
    </>
  );
}

export default App;