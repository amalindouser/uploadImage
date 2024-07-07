import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Image,
  Link,
  VStack,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";

const LoginAndUpload = () => {
  // State untuk login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State untuk upload gambar
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const { hasCopied, onCopy } = useClipboard(url);
  const toast = useToast();

  // Efek samping untuk memantau status login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setEmail(user.email);
      } else {
        setIsLoggedIn(false);
        setEmail("");
      }
    });

    return () => unsubscribe();
  }, []);

  // Efek samping untuk mengambil daftar file yang diunggah
  useEffect(() => {
    fetchFileList();
  }, []);

  // Fungsi untuk mengambil daftar file dari Firebase Storage
  const fetchFileList = () => {
    const listRef = ref(storage, 'images/');
    listAll(listRef)
      .then((res) => {
        const promises = res.items.map((itemRef) =>
          getDownloadURL(itemRef).then((url) => ({ name: itemRef.name, url }))
        );
        return Promise.all(promises);
      })
      .then((urls) => {
        setFileList(urls);
        localStorage.setItem("uploadedFiles", JSON.stringify(urls));
      })
      .catch((error) => {
        console.error("Error listing files:", error);
      });
  };

  // Fungsi untuk meng-handle perubahan pada input gambar
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Fungsi untuk meng-handle proses upload gambar
  const handleUpload = () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      uploadBytes(storageRef, image)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((downloadURL) => {
          setUrl(downloadURL);
          fetchFileList();
          toast({
            title: "Upload Successful",
            description: `File ${image.name} has been uploaded successfully.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          toast({
            title: "Upload Failed",
            description: "There was an error uploading the file.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  // Fungsi untuk meng-handle proses penghapusan file
  const handleDelete = (fileName) => {
    const storageRef = ref(storage, `images/${fileName}`);
    deleteObject(storageRef)
      .then(() => {
        console.log(`File ${fileName} deleted successfully`);
        const updatedFiles = fileList.filter((file) => file.name !== fileName);
        setFileList(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
        toast({
          title: "Deletion Successful",
          description: `File ${fileName} has been deleted successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
        toast({
          title: "Deletion Failed",
          description: `There was an error deleting the file ${fileName}.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  // Fungsi untuk meng-handle proses login
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setError("");
      })
      .catch(() => {
        setError("Invalid email or password");
      });
  };

  // Fungsi untuk meng-handle proses logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setEmail("");
        setPassword("");
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    <VStack spacing={4} align="stretch" width="100%" maxWidth="400px" margin="auto">
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
          <Input type="file" onChange={handleImageChange} />
          <Button onClick={handleUpload} colorScheme="teal">
            Upload
          </Button>
          {url && (
            <Box>
              <Text>Image URL:</Text>
              <Link href={url} isExternal color="teal.500">
                {url}
              </Link>
              <Image src={url} alt="Uploaded" boxSize="100%" maxH="300px" mt={2} objectFit="cover" />
              <Button onClick={onCopy} mt={2} colorScheme="blue">
                {hasCopied ? "Copied" : "Copy URL"}
              </Button>
            </Box>
          )}
          <Box mt={4} w="100%">
            <Text fontSize="lg" fontWeight="bold">
              Uploaded Files:
            </Text>
            {fileList.length > 0 ? (
              fileList.map((file) => (
                <Box key={file.url} mt={2} display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid #ccc" paddingBottom={2}>
                  <Link href={file.url} isExternal color="teal.500">
                    {file.name}
                  </Link>
                  <Button onClick={() => handleDelete(file.name)} colorScheme="red">
                    Delete
                  </Button>
                </Box>
              ))
            ) : (
              <Text>No files uploaded yet.</Text>
            )}
          </Box>

          <Box>You are logged in as {email}</Box>
          <Button onClick={handleLogout} colorScheme="red">
            Logout
          </Button>
        </>
      )}
    </VStack>
  );
};

export default LoginAndUpload;
