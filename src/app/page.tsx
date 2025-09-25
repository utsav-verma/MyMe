'use client';

import { useState } from 'react';
import UnifiedChat from '../components/UnifiedChat';
import LoginPage from '../components/LoginPage';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <main className="h-screen">
      {isAuthenticated ? (
        <UnifiedChat />
      ) : (
        <LoginPage onAuthenticated={handleAuthenticated} />
      )}
    </main>
  );
}