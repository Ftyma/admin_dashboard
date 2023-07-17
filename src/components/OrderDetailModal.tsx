import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Currency } from "./Currency";
import { Button } from "antd";
import axios from "axios";

export default function OrderDetailModal({ productId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState({});

  const url = import.meta.env.VITE_API;

  let total: number = 0;

  useEffect(() => {
    getProduct(productId);
  }, [isOpen, productId]);

  const getProduct = async (productId: string) => {
    try {
      const res = await axios.get(`${url}orders/getById/${productId}`);
      setSelectedProduct(res.data);
    } catch (error) {
      console.log("error fetching product", error);
    }
  };

  return (
    <>
      <Button onClick={onOpen} type="link">
        Details
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={9}>
            <SimpleGrid columns={2} spacing={1}>
              <Text fontWeight={"bold"}>Order ID: </Text>
              <Text>{selectedProduct._id}</Text>
              <Text fontWeight={"bold"}>Order Status:</Text>

              <Text>{selectedProduct.status}</Text>
            </SimpleGrid>

            <br />
            <hr />

            {selectedProduct.orders && selectedProduct.orders.length > 0 ? (
              selectedProduct.orders.map((item) => {
                total += item.quantity * item.price;

                return (
                  <React.Fragment key={item.id}>
                    <Stack>
                      <Text>{item.product_name}</Text>
                      <HStack justifyContent="space-between">
                        <Text>{item.description}</Text>
                        <Text>x{item.quantity}</Text>
                      </HStack>
                      <Text textAlign="end">{Currency(item.price)}</Text>
                      <hr />
                    </Stack>
                  </React.Fragment>
                );
              })
            ) : (
              <Text>No orders found.</Text>
            )}
            <br />
            <HStack justifyContent="space-between">
              <Text fontWeight="bold">Total:</Text>
              <Text fontWeight="bold">{Currency(total)}</Text>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
