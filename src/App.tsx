import { useState } from 'react';

import { Login } from './components/Login';
import { ChatApp } from './components/ChatApp';
import { hasAuthCredentials } from './utils/auth';


export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthCredentials());

  if (!isAuthenticated) return <Login onLogin={() => setIsAuthenticated(true)} />;

  return <ChatApp />;
}

export default App;
