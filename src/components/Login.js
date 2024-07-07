import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

const Login = ({ onLogin, isLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        onLogin(user.email);
      } else {
        onLogin("");
      }
    });

    return () => unsubscribe();
  }, [onLogin]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setError("");
      })
      .catch(() => {
        setError("Invalid email or password");
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setEmail("");
        setPassword("");
        onLogin(""); // Memperbarui status login
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    <VStack spacing={4} width="100%" maxWidth="400px" margin="auto">
      {!isLoggedIn ? (
        <>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          {error && <Box color="red.500">{error}</Box>}
          <Button onClick={handleLogin} colorScheme="teal">
            Login
          </Button>
        </>
      ) : (
        <>
          <Box>You are logged in as {email}</Box>
          <Button onClick={handleLogout} colorScheme="red">
            Logout
          </Button>
        </>
      )}
    </VStack>
  );
};

export default Login;
