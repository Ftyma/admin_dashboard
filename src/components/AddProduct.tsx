import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Image,
  Modal,
  SimpleGrid,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import UploadImage from "./UploadImage";

export default function AddProduct() {
  const url = import.meta.env.VITE_API;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newProduct, setNewProduct] = useState({
    id: "",
    product_name: "",
    sku: "",
    price: "",
    category: [],
    description: "",
    group_id: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(`${url}products/add`, newProduct)
      .then((res) => console.log(res))
      .catch((error) => {
        alert(error);
        return;
      });

    setNewProduct({
      id: "",
      product_name: "",
      sku: "",
      price: "",
      category: [],
      description: "",
      group_id: "",
      image: "",
    });
  };

  return (
    <>
      <Button
        onClick={onOpen}
        leftIcon={<PlusOutlined />}
        size="sm"
        colorScheme="blue"
        width={"10rem"}
      >
        Add New Item
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Add a new product </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={9}>
            <form>
              <FormControl>
                <Image maxW={{ base: "100%", sm: "150px" }} />
                <SimpleGrid columns={2} spacing={4}>
                  <FormLabel>Product ID:</FormLabel>
                  <Input
                    id="id"
                    name="id"
                    value={newProduct.id}
                    onChange={handleChange}
                  />

                  <FormLabel>Product Name:</FormLabel>
                  <Input
                    id="product_name"
                    name="product_name"
                    value={newProduct.product_name}
                    onChange={handleChange}
                  />

                  <FormLabel>SKU:</FormLabel>
                  <Input
                    id="sku"
                    name="sku"
                    value={newProduct.sku}
                    onChange={handleChange}
                  />

                  <FormLabel>Price:</FormLabel>
                  <Input
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleChange}
                  />

                  <FormLabel>Category:</FormLabel>
                  <Input
                    id="category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleChange}
                  />

                  <FormLabel>Group ID:</FormLabel>
                  <Input
                    id="group_id"
                    name="group_id"
                    value={newProduct.group_id}
                    onChange={handleChange}
                  />

                  <FormLabel>Description:</FormLabel>
                  <Input
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleChange}
                  />

                  <FormLabel>Image URL:</FormLabel>
                  <Input
                    id="image"
                    name="image"
                    value={newProduct.image}
                    onChange={handleChange}
                  />

                  {/* <FormLabel>Image:</FormLabel>
                  <UploadImage onChange={(file)=> 
                    setNewProduct((prevState)=> ({
                      ...prevState,
                      image: file,
                    }))
                  }/> */}
                </SimpleGrid>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
