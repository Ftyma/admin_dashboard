import { Card, CardBody, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Carousel, Col, Row } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

interface OrderType {
  status: string;
  date: Date;
  uid: string;
  orders: OrderProductType[];
}

interface OrderProductType {
  id: number;
  product_name: string;
  description: string;
  price: number;
  quantity: number;
  productStatus: number;
}

export default function Home() {
  const [orderList, setOrderList] = useState<OrderType[]>([]);
  const url = import.meta.env.VITE_API;

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      await axios.get(`${url}orders/all`).then((res) => {
        setOrderList(res.data);
        console.log("order list", res.data);
      });
    } catch (error) {
      console.log("error fetch order list");
    }
  };

  const getPopularProduct = () => {
    const productQuantity: { [productId: number]: number } = {};

    orderList.forEach((order) => {
      order.orders.forEach((product) => {
        const { id, quantity } = product;

        if (productQuantity[id]) {
          productQuantity[id] += quantity;
        } else {
          productQuantity[id] = quantity;
        }
      });
    });

    const sortedQuantities = Object.keys(productQuantity).sort(
      (a, b) => productQuantity[b] - productQuantity[a]
    );

    const top10 = sortedQuantities.slice(0, 10).map((productId) => {
      const selectedOrder = orderList.find((order) =>
        order.orders.some((product) => product.id === parseInt(productId))
      );
      const selectedProduct = selectedOrder?.orders.find(
        (product) => product.id === parseInt(productId)
      );

      if (selectedProduct) {
        return {
          id: selectedProduct.id,
          description: selectedProduct.description,
          product_name: selectedProduct.product_name,
          quantity: productQuantity[selectedProduct.id],
        };
      }
      return null;
    });

    return top10.filter((product) => product !== null);
  };

  const popularProducts = getPopularProduct();

  return (
    <div>
      <Text fontWeight={"bold"}>Top 10 Popular Products</Text>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {popularProducts.map((product) => (
          <Col className="gutter-row" span={6}>
            <Card width={"230px"} height={"150px"} marginBlock={"1rem"}>
              <CardBody>
                <p>Product Name: {product.product_name}</p>
                <p>Description: {product?.description}</p>
                <p>Quantity: {product.quantity}</p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
