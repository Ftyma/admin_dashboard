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

export default function CartDetailModal({ uid }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState([]);

  const url = import.meta.env.VITE_API;

  let total: number = 0;

  useEffect(() => {
    getProduct(uid);
  }, [isOpen, uid]);

  const getProduct = async (uid) => {
    try {
      const res = await axios.get(`${url}cart/getByUser/${uid}`);
      setSelectedProduct(res.data);
    } catch (error) {
      console.log("error fetching cart item", error);
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
          <ModalHeader>Cart Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={9}>
            {selectedProduct && selectedProduct.length > 0 ? (
              selectedProduct.map((item) => {
                total += item.quantity * item.price;

                return (
                  <React.Fragment key={item._id}>
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
