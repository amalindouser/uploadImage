// src/components/UploadImage.js
import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import {
  Box,
  Button,
  Input,
  Image,
  Link,
  VStack,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const { hasCopied, onCopy } = useClipboard(url);
  const toast = useToast();

  useEffect(() => {
    fetchFileList(); // Mengambil daftar file saat komponen dimuat
  }, []);

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
        localStorage.setItem("uploadedFiles", JSON.stringify(urls)); // Simpan di localStorage
      })
      .catch((error) => {
        console.error("Error listing files:", error);
      });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      uploadBytes(storageRef, image)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          setUrl(downloadURL);
          console.log("File available at", downloadURL);
          fetchFileList(); // Refresh daftar file setelah upload
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

  const handleDelete = (fileName) => {
    const storageRef = ref(storage, `images/${fileName}`);
    deleteObject(storageRef)
      .then(() => {
        console.log(`File ${fileName} deleted successfully`);
        const updatedFiles = fileList.filter((file) => file.name !== fileName);
        setFileList(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles)); // Perbarui localStorage setelah penghapusan
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

  return (
    <VStack spacing={4} align="stretch">
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
          <Image src={url} alt="Uploaded" boxSize="100px" mt={2} />
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
        <Button
          as={Link}
          href="https://docs.google.com/spreadsheets/d/1i_39vViXZ0vgckEZgtzebWEwDHolqHGGbr0Wm8lCXOQ/edit?usp=sharing"
          mt={2}
          colorScheme="green"
          isExternal
        >
          Go to Spreadsheet
        </Button>
        <Button
          marginLeft={9}
          as={Link}
          href="https://vnd-ceper.vercel.app/"
          mt={2}
          colorScheme="blue"
          isExternal
        >
          Go to Website
        </Button>
      </Box>
    </VStack>
  );
};

export default UploadImage;
