import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Stack,
  Heading,
  Image,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Currency } from "../components/Currency";
import ProductModal from "../components/ProductModal";

export default function Items() {
  const url = import.meta.env.VITE_API;

  const [productList, setProductList] = useState<Object[] | undefined>([]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      await axios.get(`${url}products/all`).then((res) => {
        setProductList(res.data);
        console.log("product list", res.data);
      });
    } catch (error) {
      console.log("error fetch product list");
    }
  };

  const handleDelete = async (productId: any) => {
    try {
      await axios.delete(`${url}products/delete/${productId}`);
      console.log("Deleted item: ", productId);
      alert(`Successfully deleted item ${productId}`);
      setProductList((prevProductList) =>
        prevProductList.filter((product) => product._id !== productId)
      );
    } catch (error) {
      alert("error delete product");
    }
  };

  console.log("helo");

  return (
    <SimpleGrid spacing={4} justifyContent="center" alignItems="center">
      {productList?.map((product, i) => (
        <Card key={i} direction="row" justifyContent={"center"}>
          <Image maxW={{ base: "100%", sm: "100px" }} src={product.image} />

          <CardBody>
            <Heading size="xs">{product.product_name}</Heading>
            <Text>{product.description}</Text>
            <Text>{Currency(product.price)}</Text>
          </CardBody>
          <CardBody>
            <Stack spacing={4} direction={"row"}>
              <Button
                onClick={() => handleDelete(product._id)}
                leftIcon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
              >
                Delete
              </Button>
              <ProductModal productId={product._id} />
            </Stack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
}
