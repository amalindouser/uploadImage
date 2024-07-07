import React, { useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import LoginAndUpload from './components/LoginAndUpload';

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
    <Box className="App" textAlign="center" p={4} minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box width={{ base: '90%', md: '50%' }}>
        <Heading as="h1" mb={4}>Welcome to VND Ceper Industries</Heading>
        <LoginAndUpload onLogin={handleLogin} isLoggedIn={isLoggedIn} />
      </Box>
    </Box>
  );
};

export default App;
