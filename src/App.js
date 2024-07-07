import React, { useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Login from './components/Login';
import UploadImage from './components/UploadImage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <Box className="App" textAlign="center" p={4} width="100%" display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Box width="50%">
        <Heading as="h1" mb={4}>Welcome to VND Ceper Industries</Heading>
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} isLoggedIn={isLoggedIn} />
        ) : (
          <UploadImage userEmail={userEmail} onLogout={handleLogout} />
        )}
      </Box>
    </Box>
  );
};

export default App;
