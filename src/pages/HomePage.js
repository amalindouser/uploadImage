import React from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const HomePage = ({ userEmail, onLogout }) => {
  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h1" size="xl" mb={4} textAlign="center">
        Welcome to VND Ceper Industries
      </Heading>
      <Box mt={4} textAlign="center">
        <Heading as="h2" size="md">
          Welcome, {userEmail}!
        </Heading>
        <Box mt={2}>
          <Button onClick={onLogout} colorScheme="red">
            Logout
          </Button>
        </Box>
        <Box mt={4}>
          <Button as={Link} to="/upload" colorScheme="teal" mr={2}>
            Upload Image
          </Button>
          <Button
            as={Link}
            to="/files"
            colorScheme="blue"
          >
            View Uploaded Files
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
