import {
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
import { Button } from "antd";
import { EditIcon } from "@chakra-ui/icons";
import { Currency } from "./Currency";
import axios from "axios";

export default function ProductModal({ productId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState({});

  const url = import.meta.env.VITE_API;

  useEffect(() => {
    getProduct(productId);
  }, [isOpen, productId]);

  const getProduct = async (productId: string) => {
    try {
      const res = await axios.get(`${url}products/getById/${productId}`);
      setSelectedProduct(res.data);
    } catch (error) {
      console.log("error fetching product", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = (productId: string) => {
    try {
      axios
        .put(`${url}products/update/${productId}`, selectedProduct)
        .then((res) => {
          setSelectedProduct(res.data);
          console.log("Product updated successfully:", res.data);
        })
        .then(() => onClose());
    } catch (error) {
      console.log("error fetching product", error);
    }
  };

  const refetchProduct = () => {
    getProduct(productId);
  };

  return (
    <>
      <Button onClick={onOpen} type="link">
        Edit
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={9}>
            <form>
              <FormControl>
                <SimpleGrid columns={2} spacing={4}>
                  <FormLabel>Product ID:</FormLabel>
                  <Input
                    id="id"
                    name="id"
                    onChange={handleChange}
                    value={selectedProduct._id}
                  />

                  <FormLabel>Product Name:</FormLabel>
                  <Input
                    id="product_name"
                    name="product_name"
                    onChange={handleChange}
                    value={selectedProduct.product_name}
                  />

                  <FormLabel>SKU:</FormLabel>
                  <Input
                    id="sku"
                    name="sku"
                    onChange={handleChange}
                    value={selectedProduct.sku}
                  />

                  <FormLabel>Price:</FormLabel>
                  <Input
                    id="price"
                    name="price"
                    onChange={handleChange}
                    value={selectedProduct.price}
                  />

                  <FormLabel>Group ID:</FormLabel>
                  <Input
                    id="group_id"
                    name="group_id"
                    onChange={handleChange}
                    value={selectedProduct.group_id}
                  />

                  <FormLabel>Category:</FormLabel>
                  <Input
                    id="category"
                    name="category"
                    onChange={handleChange}
                    value={selectedProduct.category}
                  />

                  <FormLabel>Description:</FormLabel>
                  <Input
                    id="description"
                    name="description"
                    onChange={handleChange}
                    value={selectedProduct.description}
                  />

                  <FormLabel>Image URL:</FormLabel>
                  <Input
                    id="image"
                    name="image"
                    onChange={handleChange}
                    value={selectedProduct.image}
                  />
                </SimpleGrid>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => handleUpdate(selectedProduct._id)}>
              Save
            </Button>
            <Button
              onClick={() => {
                onClose();
                refetchProduct();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
