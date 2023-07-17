import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table, message, Popconfirm } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";

import { Currency } from "../components/Currency";

import Highlighter from "react-highlight-words";
import axios from "axios";
import AddProduct from "../components/AddProduct";
import { Stack } from "@chakra-ui/react";
import ProductModal from "../components/ProductModal";

interface ProductType {
  id: number;
  sku: string;
  product_name: string;
  description: string;
  price: number;
  image: string;
  group_id: number;
  category: number[];
  quanitity: number;
}

type DataIndex = keyof ProductType;

export default function Categories() {
  const [productList, setProductList] = useState<ProductType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const url = import.meta.env.VITE_API;

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

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  //delete
  const handleDelete = async (productId: number) => {
    try {
      await axios.patch(`${url}products/delete/${productId}`);
      //fetchProduct();
      setProductList((prevProductList) =>
        prevProductList.filter((product) => product.id !== productId)
      );
      message.success("Sucessfully Deleted.");
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<ProductType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) =>
      dataIndex === "category" ? (
        record.category.join(", ")
      ) : dataIndex === "price" ? (
        <span>{Currency(text)}</span>
      ) : searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<ProductType> = [
    {
      title: "Image",
      render: (_, record) => {
        return <img src={record.image} style={{ width: "100px" }} />;
      },
    },
    {
      title: "Product_name",
      dataIndex: "product_name",
      key: "product_name",
      width: "20%",
      ...getColumnSearchProps("product_name"),
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
      width: "10%",
      ...getColumnSearchProps("sku"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      ...getColumnSearchProps("price"),
      sorter: (a, b) => a.price.length - b.price.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "10%",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "10%",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Group_id",
      dataIndex: "group_id",
      key: "group_id",
      width: "5%",
      ...getColumnSearchProps("group_id"),
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <>
            <Popconfirm
              title="Are you sure to remove this product?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link">Delete</Button>
            </Popconfirm>
            <ProductModal productId={record._id} />
          </>
        );
      },
    },
  ];

  return (
    <>
      <Stack marginBlock={"2rem"}>
        <AddProduct />
        <br />
        <Table
          columns={columns}
          dataSource={productList}
          style={{ justifyContent: "center" }}
        />
      </Stack>
    </>
  );
}
