import React, { useEffect, useState } from "react";
import axios from "axios";
import { Flex } from "@chakra-ui/react";

export default function Product() {
  const url = import.meta.env.VITE_API;

  const [productList, setProductList] = useState([]);

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

  console.log("helo");

  return (
    <div>
      <Flex justifyContent={"center"}>
        {productList.map((product) => (
          <h1>{product.product_name}</h1>
        ))}
      </Flex>
    </div>
  );
}
